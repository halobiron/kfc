const Role = require('../models/roleSchema');
const User = require('../models/userSchema');

// Create new role
exports.createRole = async (req, res, next) => {
    try {
        const { name, code, description, permissions } = req.body;

        const role = await Role.create({
            name,
            code: code ? code.toUpperCase() : undefined,
            description,
            permissions
        });

        res.status(201).json({
            status: true,
            data: role
        });
    } catch (error) {
        next(error);
    }
};

// Get all roles
exports.getAllRoles = async (req, res, next) => {
    try {
        const roles = await Role.find();

        res.status(200).json({
            status: true,
            results: roles.length,
            data: roles
        });
    } catch (error) {
        next(error);
    }
};

// Update role
exports.updateRole = async (req, res, next) => {
    try {
        const { name, code, description, permissions } = req.body;

        const role = await Role.findByIdAndUpdate(
            req.params.id,
            { name, code, description, permissions, updatedAt: Date.now() },
            { new: true, runValidators: true }
        );

        if (!role) {
            return res.status(404).json({
                status: false,
                message: 'Không tìm thấy vai trò này'
            });
        }

        res.status(200).json({
            status: true,
            data: role
        });
    } catch (error) {
        next(error);
    }
};

// Delete role
exports.deleteRole = async (req, res, next) => {
    try {
        const role = await Role.findById(req.params.id);

        if (!role) {
            return res.status(404).json({
                status: false,
                message: 'Không tìm thấy vai trò này'
            });
        }

        // Check if role is used by any user
        const users = await User.find({ role: role._id });
        if (users.length > 0) {
            return res.status(400).json({
                status: false,
                message: 'Không thể xóa vai trò đang được sử dụng bởi người dùng'
            });
        }

        await role.deleteOne();

        res.status(204).json({
            status: true,
            data: null
        });
    } catch (error) {
        next(error);
    }
};
