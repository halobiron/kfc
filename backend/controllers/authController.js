const User = require('../models/userSchema');
const jwt = require('jsonwebtoken');

// Create JWT Token
const sendToken = async (user, statusCode, res) => {
    // Populate role permissions if available
    let permissions = [];
    if (user.role && user.role.permissions) {
        permissions = user.role.permissions;
    }

    const roleName = user.role?.name || 'customer';

    const token = jwt.sign(
        { id: user._id, role: roleName, storeId: user.storeId, permissions },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE }
    );

    const cookieOptions = {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production'
    };

    res.cookie('token', token, cookieOptions);

    res.status(statusCode).json({
        status: true,
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: roleName,
            roleId: user.role, // keeping roleId for compatibility
            permissions,
            storeId: user.storeId,
            position: user.position
        }
    });
};

// REGISTER
exports.registerUser = async (req, res, next) => {
    const { name, email, phone, password, confirmPassword } = req.body;

    try {
        // Validation
        if (!name || !email || !phone || !password || !confirmPassword) {
            return res.status(400).json({
                status: false,
                message: 'Vui lòng điền đầy đủ thông tin'
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                status: false,
                message: 'Mật khẩu không khớp'
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                status: false,
                message: 'Email này đã được đăng ký'
            });
        }

        const Role = require('../models/roleSchema');
        const customerRole = await Role.findOne({ name: 'customer' });

        // Create user
        const user = await User.create({
            name,
            email,
            phone,
            password,
            role: customerRole ? customerRole._id : null
        });

        // Populate role for sendToken
        if (customerRole) user.role = customerRole;

        // Send token
        await sendToken(user, 201, res);
    } catch (error) {
        next(error);
    }
};

// LOGIN
exports.loginUser = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        // Validation
        if (!email || !password) {
            return res.status(400).json({
                status: false,
                message: 'Vui lòng nhập email và mật khẩu'
            });
        }

        // Find user and select password
        const user = await User.findOne({ email }).select('+password').populate('role');
        if (!user) {
            return res.status(401).json({
                status: false,
                message: 'Email hoặc mật khẩu không chính xác'
            });
        }

        // Check if user is active
        if (user.isActive === false) {
            return res.status(403).json({
                status: false,
                message: 'Tài khoản của bạn đã bị vô hiệu hóa. Vui lòng liên hệ quản trị viên.'
            });
        }

        // Check password
        const isPasswordMatched = await user.matchPassword(password);
        if (!isPasswordMatched) {
            return res.status(401).json({
                status: false,
                message: 'Email hoặc mật khẩu không chính xác'
            });
        }

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        // Send token
        await sendToken(user, 200, res);
    } catch (error) {
        next(error);
    }
};

// LOGOUT
exports.logoutUser = async (req, res, next) => {
    try {
        res.cookie('token', null, {
            expires: new Date(Date.now()),
            httpOnly: true
        });

        res.status(200).json({
            status: true,
            message: 'Đăng xuất thành công'
        });
    } catch (error) {
        next(error);
    }
};

// GET CURRENT USER
exports.getCurrentUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).populate('role');
        res.status(200).json({
            status: true,
            user: user
        });
    } catch (error) {
        next(error);
    }
};

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// GOOGLE LOGIN
exports.googleLogin = async (req, res, next) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({
                status: false,
                message: 'Token không hợp lệ'
            });
        }

        // Set credentials with the access token
        client.setCredentials({ access_token: token });

        // Get user info from Google
        const userRes = await client.request({
            url: 'https://www.googleapis.com/oauth2/v3/userinfo'
        });

        const { name, email } = userRes.data;

        let user = await User.findOne({ email });

        if (!user) {
            // Generate a random password for google users
            const randomPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);

            const Role = require('../models/roleSchema');
            const customerRole = await Role.findOne({ name: 'customer' });

            user = await User.create({
                name,
                email,
                password: randomPassword,
                role: customerRole ? customerRole._id : null
            });
            if (customerRole) user.role = customerRole;
        } else {
            // If user exists, check if active
            if (user.isActive === false) {
                return res.status(403).json({
                    status: false,
                    message: 'Tài khoản của bạn đã bị vô hiệu hóa. Vui lòng liên hệ quản trị viên.'
                });
            }
        }

        sendToken(user, 200, res);
    } catch (error) {
        next(error);
    }
};
