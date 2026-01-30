const User = require('../models/userSchema');

// GET USER PROFILE
exports.getUserProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        res.status(200).json({
            status: true,
            data: user
        });
    } catch (error) {
        next(error);
    }
};

// UPDATE USER PROFILE
exports.updateUserProfile = async (req, res, next) => {
    const { name, phone, avatar, birthdate } = req.body;

    try {
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
    } catch (error) {
        next(error);
    }
};

// CHANGE PASSWORD
exports.changePassword = async (req, res, next) => {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    try {
        if (!currentPassword || !newPassword || !confirmPassword) {
            return res.status(400).json({
                status: false,
                message: 'Vui lòng điền đầy đủ thông tin'
            });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                status: false,
                message: 'Mật khẩu mới không khớp'
            });
        }

        const user = await User.findById(req.user.id).select('+password');
        const isPasswordMatched = await user.matchPassword(currentPassword);

        if (!isPasswordMatched) {
            return res.status(401).json({
                status: false,
                message: 'Mật khẩu hiện tại không chính xác'
            });
        }

        user.password = newPassword;
        await user.save();

        res.status(200).json({
            status: true,
            message: 'Thay đổi mật khẩu thành công'
        });
    } catch (error) {
        next(error);
    }
};

// ADD ADDRESS
exports.addAddress = async (req, res, next) => {
    const { label, fullAddress, isDefault } = req.body;

    try {
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
            isDefault: isDefault || user.addresses.length === 0
        });

        await user.save();

        res.status(201).json({
            status: true,
            message: 'Thêm địa chỉ thành công',
            data: user.addresses
        });
    } catch (error) {
        next(error);
    }
};

// UPDATE ADDRESS
exports.updateAddress = async (req, res, next) => {
    const { addressId } = req.params;
    const { label, fullAddress, isDefault } = req.body;

    try {
        const user = await User.findById(req.user.id);
        const addressIndex = user.addresses.findIndex(addr => addr._id.toString() === addressId);

        if (addressIndex === -1) {
            return res.status(404).json({
                status: false,
                message: 'Địa chỉ không tìm thấy'
            });
        }

        if (isDefault) {
            user.addresses.forEach((addr, idx) => {
                addr.isDefault = idx === addressIndex;
            });
        }

        user.addresses[addressIndex] = { ...user.addresses[addressIndex], label, fullAddress };
        await user.save();

        res.status(200).json({
            status: true,
            message: 'Cập nhật địa chỉ thành công',
            data: user.addresses
        });
    } catch (error) {
        next(error);
    }
};

// DELETE ADDRESS
exports.deleteAddress = async (req, res, next) => {
    const { addressId } = req.params;

    try {
        const user = await User.findById(req.user.id);
        user.addresses = user.addresses.filter(addr => addr._id.toString() !== addressId);
        await user.save();

        res.status(200).json({
            status: true,
            message: 'Xóa địa chỉ thành công',
            data: user.addresses
        });
    } catch (error) {
        next(error);
    }
};

// ADMIN: GET ALL USERS
exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find({ role: 'customer' });
        res.status(200).json({
            status: true,
            data: users
        });
    } catch (error) {
        next(error);
    }
};

// ADMIN: GET USER BY ID
exports.getUserById = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({
                status: false,
                message: 'Người dùng không tìm thấy'
            });
        }
        res.status(200).json({
            status: true,
            data: user
        });
    } catch (error) {
        next(error);
    }
};

// ADMIN: DELETE USER
exports.deleteUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({
                status: false,
                message: 'Người dùng không tìm thấy'
            });
        }

        user.isActive = false;
        await user.save();

        res.status(200).json({
            status: true,
            message: 'Vô hiệu hóa người dùng thành công'
        });
    } catch (error) {
        next(error);
    }
};
