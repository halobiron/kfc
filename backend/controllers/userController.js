const User = require('../models/userSchema');
const Role = require('../models/roleSchema');
const { catchAsyncErrors } = require('../middleware/errors');
const ErrorHandler = require('../utils/errorHandler');

// UPDATE USER PROFILE
exports.updateUserProfile = catchAsyncErrors(async (req, res, next) => {
    const { name, phone, avatar, birthdate } = req.body;
    const user = await User.findByIdAndUpdate(
        req.user.id,
        { name, phone, avatar, birthdate, updatedAt: new Date() },
        { new: true, runValidators: true }
    ).populate('role');

    res.status(200).json({ status: true, message: 'Cập nhật thành công', data: user });
});

// CHANGE PASSWORD
exports.changePassword = catchAsyncErrors(async (req, res, next) => {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    if (newPassword !== confirmPassword) return next(new ErrorHandler('Mật khẩu không khớp', 400));

    const user = await User.findById(req.user.id).select('+password');
    if (!(await user.matchPassword(currentPassword))) return next(new ErrorHandler('Mật khẩu cũ sai', 401));

    user.password = newPassword;
    await user.save();
    res.status(200).json({ status: true, message: 'Đổi mật khẩu thành công' });
});

// ADMIN: GET ALL USERS
exports.getAllUsers = catchAsyncErrors(async (req, res, next) => {
    const users = await User.find().populate('role');
    res.status(200).json({ status: true, data: users });
});

// ADMIN: GET USER BY ID
exports.getUserById = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id).populate('role');
    if (!user) return next(new ErrorHandler('Không tìm thấy', 404));
    res.status(200).json({ status: true, data: user });
});

// ADMIN: CREATE USER
exports.createUser = catchAsyncErrors(async (req, res, next) => {
    const user = await User.create(req.body);
    const populatedUser = await User.findById(user._id).populate('role');
    res.status(201).json({ status: true, message: 'Tạo thành công', data: populatedUser });
});

// ADMIN: UPDATE USER
exports.updateUser = catchAsyncErrors(async (req, res, next) => {
    if (req.body.password === '') delete req.body.password;

    // Nếu có password mới, cần save bằng tay để hash
    if (req.body.password) {
        const user = await User.findById(req.params.id);
        user.password = req.body.password;
        await user.save();
        delete req.body.password;
    }

    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true, runValidators: true
    }).populate('role');

    res.status(200).json({ status: true, message: 'Cập nhật thành công', data: user });
});

// ADMIN: DELETE USER
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ status: true, message: 'Xóa thành công' });
});

// ADDRESS METHODS (giữ nguyên logic gốc của bạn nhưng rút gọn)
exports.addAddress = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    if (req.body.isDefault) user.addresses.forEach(a => a.isDefault = false);
    user.addresses.push(req.body);
    await user.save();
    res.status(201).json({ status: true, data: user.addresses });
});

exports.updateAddress = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    const idx = parseInt(req.params.addressId);
    if (req.body.isDefault) user.addresses.forEach(a => a.isDefault = false);
    user.addresses[idx] = { ...user.addresses[idx], ...req.body };
    await user.save();
    res.status(200).json({ status: true, data: user.addresses });
});

exports.deleteAddress = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    user.addresses.splice(parseInt(req.params.addressId), 1);
    await user.save();
    res.status(200).json({ status: true, data: user.addresses });
});
