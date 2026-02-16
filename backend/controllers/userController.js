const User = require('../models/userSchema');
const { catchAsyncErrors } = require('../middleware/errors');
const ErrorHandler = require('../utils/errorHandler');




// UPDATE USER PROFILE
exports.updateUserProfile = catchAsyncErrors(async (req, res, next) => {
    const { name, phone, avatar, birthdate } = req.body;

    const user = await User.findByIdAndUpdate(
        req.user.id,
        { name, phone, avatar, birthdate, updatedAt: new Date() },
        { new: true, runValidators: true }
    );

    res.status(200).json({
        status: true,
        message: 'Cập nhật thông tin thành công',
        data: user
    });
});

// CHANGE PASSWORD
exports.changePassword = catchAsyncErrors(async (req, res, next) => {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
        return next(new ErrorHandler('Vui lòng điền đầy đủ thông tin', 400));
    }

    if (newPassword !== confirmPassword) {
        return next(new ErrorHandler('Mật khẩu mới không khớp', 400));
    }

    const user = await User.findById(req.user.id).select('+password');
    const isPasswordMatched = await user.matchPassword(currentPassword);

    if (!isPasswordMatched) {
        return next(new ErrorHandler('Mật khẩu hiện tại không chính xác', 401));
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
        status: true,
        message: 'Thay đổi mật khẩu thành công'
    });
});

// ADD ADDRESS
exports.addAddress = catchAsyncErrors(async (req, res, next) => {
    const { label, fullAddress, isDefault, latitude, longitude } = req.body;

    const user = await User.findById(req.user.id);

    // If this is default, remove default from others
    if (isDefault) {
        user.addresses.forEach(addr => {
            addr.isDefault = false;
        });
    }

    user.addresses.push({
        label,
        fullAddress,
        latitude,
        longitude,
        isDefault: isDefault || user.addresses.length === 0
    });

    await user.save();

    res.status(201).json({
        status: true,
        message: 'Thêm địa chỉ thành công',
        data: user.addresses
    });
});

// UPDATE ADDRESS
exports.updateAddress = catchAsyncErrors(async (req, res, next) => {
    const { addressId } = req.params;
    const { label, fullAddress, isDefault, latitude, longitude } = req.body;
    const idx = parseInt(addressId);

    const user = await User.findById(req.user.id);

    if (idx < 0 || idx >= user.addresses.length) {
        return next(new ErrorHandler('Địa chỉ không tìm thấy', 404));
    }

    if (isDefault) {
        user.addresses.forEach((addr, i) => {
            addr.isDefault = i === idx;
        });
    } else {
        user.addresses[idx].isDefault = false;
    }

    user.addresses[idx].label = label;
    user.addresses[idx].fullAddress = fullAddress;
    user.addresses[idx].latitude = latitude;
    user.addresses[idx].longitude = longitude;
    await user.save();

    res.status(200).json({
        status: true,
        message: 'Cập nhật địa chỉ thành công',
        data: user.addresses
    });
});

// DELETE ADDRESS
exports.deleteAddress = catchAsyncErrors(async (req, res, next) => {
    const { addressId } = req.params;
    const idx = parseInt(addressId);

    const user = await User.findById(req.user.id);

    if (idx < 0 || idx >= user.addresses.length) {
        return next(new ErrorHandler('Địa chỉ không tìm thấy', 404));
    }

    user.addresses.splice(idx, 1);

    // Nếu xóa địa chỉ mặc định, đặt địa chỉ đầu tiên làm mặc định
    if (user.addresses.length > 0 && !user.addresses.some(addr => addr.isDefault)) {
        user.addresses[0].isDefault = true;
    }

    await user.save();

    res.status(200).json({
        status: true,
        message: 'Xóa địa chỉ thành công',
        data: user.addresses
    });
});

// ADMIN: GET ALL USERS
exports.getAllUsers = catchAsyncErrors(async (req, res, next) => {
    const users = await User.find().populate('role');
    res.status(200).json({
        status: true,
        data: users
    });
});

// ADMIN: GET USER BY ID
exports.getUserById = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id).populate('role');
    if (!user) {
        return next(new ErrorHandler('Người dùng không tìm thấy', 404));
    }
    res.status(200).json({
        status: true,
        data: user
    });
});

// ADMIN: CREATE USER
exports.createUser = catchAsyncErrors(async (req, res, next) => {
    const { name, email, password, role, phone } = req.body;
    const Role = require('../models/roleSchema');
    const roleObj = await Role.findOne({ code: role });

    const user = await User.create({
        name,
        email,
        password,
        role: roleObj ? roleObj._id : null,
        phone
    });

    if (roleObj) {
        // Populate custom field if needed for response
        user.role = roleObj;
    }

    res.status(201).json({
        status: true,
        message: 'Tạo người dùng thành công',
        data: user
    });
});

// ADMIN: UPDATE USER
exports.updateUser = catchAsyncErrors(async (req, res, next) => {
    const newData = {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        isActive: req.body.isActive
    };

    // If role changed, find the role object
    if (req.body.role) {
        const Role = require('../models/roleSchema');
        const roleObj = await Role.findOne({ code: req.body.role });
        if (roleObj) {
            newData.role = roleObj._id;
        } else {
            // don't update if valid role not found
        }
    }

    // Update password only if provided
    if (req.body.password && req.body.password !== '') {
        const user = await User.findById(req.params.id);
        if (!user) {
            return next(new ErrorHandler('User not found', 404));
        }
        user.password = req.body.password;
        await user.save();
    }

    const user = await User.findByIdAndUpdate(req.params.id, newData, {
        new: true,
        runValidators: true,

    });

    if (!user) {
        return next(new ErrorHandler('User not found', 404));
    }

    res.status(200).json({
        status: true,
        message: 'Cập nhật người dùng thành công',
        data: user
    });
});

// ADMIN: DELETE USER
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new ErrorHandler('Người dùng không tìm thấy', 404));
    }

    await user.deleteOne();

    res.status(200).json({
        status: true,
        message: 'Xóa người dùng thành công'
    });
});
