const User = require('../models/userSchema');
const jwt = require('jsonwebtoken');

// Create JWT Token
const sendToken = async (user, statusCode, res) => {
    // Populate role permissions if available
    let permissions = [];
    if (user.role && user.role.permissions) {
        permissions = user.role.permissions;
    }

    // Role is now just the code string (e.g., 'ADMIN', 'CUSTOMER')
    const roleCode = user.role?.code || 'CUSTOMER';

    const token = jwt.sign(
        { id: user._id, role: roleCode, storeId: user.storeId, permissions },
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
        data: {
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: roleCode,
            roleId: user.role._id || user.role, // role might be object or ID
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
        let customerRole = await Role.findOne({ code: 'CUSTOMER' });

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
            data: user
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

// FORGOT PASSWORD
exports.forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                status: false,
                message: 'Vui lòng nhập email'
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                status: false,
                message: 'Không tìm thấy tài khoản với email này'
            });
        }

        // Get reset token
        const resetToken = user.getResetPasswordToken();
        await user.save({ validateBeforeSave: false });

        // Create reset URL
        const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;

        const message = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #e4002b;">Đặt lại mật khẩu KFC</h2>
                <p>Xin chào ${user.name},</p>
                <p>Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản KFC của mình.</p>
                <p>Vui lòng nhấp vào nút bên dưới để đặt lại mật khẩu:</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${resetUrl}" style="background-color: #e4002b; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Đặt lại mật khẩu</a>
                </div>
                <p>Hoặc sao chép và dán liên kết sau vào trình duyệt của bạn:</p>
                <p style="color: #666; word-break: break-all;">${resetUrl}</p>
                <p style="color: #999; font-size: 12px; margin-top: 30px;">
                    Link này sẽ hết hạn sau 10 phút.<br>
                    Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.
                </p>
            </div>
        `;

        try {
            const sendEmail = require('../utils/sendEmail');
            await sendEmail({
                email: user.email,
                subject: 'Đặt lại mật khẩu KFC',
                message
            });

            res.status(200).json({
                status: true,
                message: 'Email đặt lại mật khẩu đã được gửi'
            });
        } catch (error) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save({ validateBeforeSave: false });

            return res.status(500).json({
                status: false,
                message: 'Không thể gửi email. Vui lòng thử lại sau.'
            });
        }
    } catch (error) {
        next(error);
    }
};

// RESET PASSWORD
exports.resetPassword = async (req, res, next) => {
    try {
        const crypto = require('crypto');

        // Hash URL token
        const resetPasswordToken = crypto
            .createHash('sha256')
            .update(req.params.token)
            .digest('hex');

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                status: false,
                message: 'Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn'
            });
        }

        const { password, confirmPassword } = req.body;

        if (!password || !confirmPassword) {
            return res.status(400).json({
                status: false,
                message: 'Vui lòng nhập mật khẩu mới'
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                status: false,
                message: 'Mật khẩu không khớp'
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                status: false,
                message: 'Mật khẩu phải có ít nhất 6 ký tự'
            });
        }

        // Set new password
        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        res.status(200).json({
            status: true,
            message: 'Đặt lại mật khẩu thành công'
        });
    } catch (error) {
        next(error);
    }
};
