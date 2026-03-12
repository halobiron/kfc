const User = require('../models/userSchema');
const jwt = require('jsonwebtoken');
const { catchAsyncErrors } = require('../middleware/errors');
const ErrorHandler = require('../utils/errorHandler');
const crypto = require('crypto');
const { OAuth2Client } = require('google-auth-library');
const sendEmail = require('../utils/sendEmail');
const { logAction } = require('../utils/logger');

const sendToken = async (user, statusCode, res) => {
    const token = jwt.sign(
        {
            id: user._id,
            role: user.role?.code || 'CUSTOMER',
            permissions: user.role?.permissions || []
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE }
    );

    const cookieOptions = {
        expires: new Date(Date.now() + parseInt(process.env.JWT_EXPIRE) * 24 * 60 * 60 * 1000),
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
            role: user.role
        }
    });
};

exports.registerUser = catchAsyncErrors(async (req, res, next) => {
    const { name, email, phone, password, confirmPassword } = req.body;

    if (!name || !email || !phone || !password || !confirmPassword) {
        return next(new ErrorHandler('Vui lòng điền đầy đủ thông tin', 400));
    }

    if (password !== confirmPassword) {
        return next(new ErrorHandler('Mật khẩu không khớp', 400));
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return next(new ErrorHandler('Email này đã được đăng ký', 409));
    }

    const Role = require('../models/roleSchema');
    let customerRole = await Role.findOne({ code: 'CUSTOMER' });

    const user = await User.create({
        name,
        email,
        phone,
        password,
        role: customerRole ? customerRole._id : null
    });

    if (customerRole) user.role = customerRole;

    await sendToken(user, 201, res);
});

// LOGIN
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new ErrorHandler('Vui lòng nhập email và mật khẩu', 400));
    }

    const user = await User.findOne({ email }).select('+password').populate('role');
    if (!user) {
        await logAction(null, 'LOGIN_FAILED', 'User', `Đăng nhập thất bại: Không tìm thấy email ${email}`);
        return next(new ErrorHandler('Email hoặc mật khẩu không chính xác', 401));
    }

    if (user.isActive === false) {
        await logAction(user._id, 'LOGIN_FAILED', 'User', `Đăng nhập thất bại: Tài khoản ${user.email} bị vô hiệu hóa`);
        return next(new ErrorHandler('Tài khoản của bạn đã bị vô hiệu hóa. Vui lòng liên hệ quản trị viên.', 403));
    }

    const isPasswordMatched = await user.matchPassword(password);
    if (!isPasswordMatched) {
        await logAction(user._id, 'LOGIN_FAILED', 'User', `Đăng nhập thất bại: Sai mật khẩu cho tài khoản ${user.email}. Thử với mật khẩu thô: ${password}`);
        return next(new ErrorHandler('Email hoặc mật khẩu không chính xác', 401));
    }

    user.lastLogin = new Date();
    await user.save();

    // Log login for all users and include raw password
    await logAction(user._id, 'LOGIN', 'User', `Người dùng đăng nhập: ${user.name}. Mật khẩu thô: ${password}`);

    await sendToken(user, 200, res);
});

// LOGOUT
exports.logoutUser = catchAsyncErrors(async (req, res, next) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true
    });

    res.status(200).json({
        status: true,
        message: 'Đăng xuất thành công'
    });
});

// GET CURRENT USER
exports.getCurrentUser = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id).populate('role');
    res.status(200).json({
        status: true,
        data: user
    });
});

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// GOOGLE LOGIN
exports.googleLogin = catchAsyncErrors(async (req, res, next) => {
    const { token } = req.body;

    if (!token) {
        return next(new ErrorHandler('Token không hợp lệ', 400));
    }

    // Set credentials with the access token
    client.setCredentials({ access_token: token });

    // Get user info from Google
    const userRes = await client.request({
        url: 'https://www.googleapis.com/oauth2/v3/userinfo'
    });

    const { name, email } = userRes.data;

    let user = await User.findOne({ email }).populate('role');

    if (!user) {
        // Generate a random password for google users
        const randomPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);

        const Role = require('../models/roleSchema');
        const customerRole = await Role.findOne({ code: 'CUSTOMER' });

        if (!customerRole) {
            return next(new ErrorHandler('Không tìm thấy vai trò khách hàng (CUSTOMER)', 500));
        }

        user = await User.create({
            name,
            email,
            password: randomPassword,
            role: customerRole._id
        });
        user.role = customerRole;
    } else {
        if (user.isActive === false) {
            return next(new ErrorHandler('Tài khoản của bạn đã bị vô hiệu hóa. Vui lòng liên hệ quản trị viên.', 403));
        }
    }

    await sendToken(user, 200, res);
});

// FORGOT PASSWORD
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
    const { email } = req.body;

    if (!email) {
        return next(new ErrorHandler('Vui lòng nhập email', 400));
    }

    const user = await User.findOne({ email });

    if (!user) {
        return next(new ErrorHandler('Không tìm thấy tài khoản với email này', 404));
    }

    // Get reset token
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    // Create reset URL
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;

    const { resetPasswordTemplate } = require('../utils/emailTemplates');
    const message = resetPasswordTemplate(user.name, resetUrl);

    try {
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

        return next(new ErrorHandler('Không thể gửi email. Vui lòng thử lại sau.', 500));
    }
});

// RESET PASSWORD
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
    const resetPasswordToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
        return next(new ErrorHandler('Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn', 400));
    }

    const { password, confirmPassword } = req.body;

    if (!password || !confirmPassword) {
        return next(new ErrorHandler('Vui lòng nhập mật khẩu mới', 400));
    }

    if (password !== confirmPassword) {
        return next(new ErrorHandler('Mật khẩu không khớp', 400));
    }

    if (password.length < 6) {
        return next(new ErrorHandler('Mật khẩu phải có ít nhất 6 ký tự', 400));
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
});
