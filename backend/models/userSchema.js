const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const { Schema } = mongoose;

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Tên người dùng là bắt buộc'],
        minlength: [2, 'Tên phải có ít nhất 2 ký tự'],
        maxlength: [50, 'Tên không được vượt quá 50 ký tự']
    },
    email: {
        type: String,
        required: [true, 'Email là bắt buộc'],
        unique: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Vui lòng nhập email hợp lệ']
    },
    phone: {
        type: String,
        match: [/^[0-9]{10,11}$/, 'Số điện thoại không hợp lệ']
    },
    password: {
        type: String,
        required: [true, 'Mật khẩu là bắt buộc'],
        minlength: [6, 'Mật khẩu phải có ít nhất 6 ký tự'],
        select: false
    },
    addresses: [
        {
            label: String,
            fullAddress: String,
            latitude: Number,
            longitude: Number,
            isDefault: {
                type: Boolean,
                default: false
            }
        }
    ],
    birthdate: {
        type: Date
    },
    role: {
        type: Schema.Types.ObjectId,
        ref: 'Role',
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    lastLogin: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date
});

// Hash password trước khi lưu
userSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Method so sánh password
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Generate password reset token
userSchema.methods.getResetPasswordToken = function () {
    const crypto = require('crypto');

    // Generate token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hash token and set to resetPasswordToken field
    this.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    // Set expire time (10 minutes)
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    return resetToken;
};

const User = mongoose.model('User', userSchema);
module.exports = User;

