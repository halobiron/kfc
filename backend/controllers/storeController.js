const Store = require('../models/storeSchema');

// GET ALL STORES
exports.getAllStores = async (req, res, next) => {
    try {
        const stores = await Store.find({ isActive: true });

        res.status(200).json({
            status: true,
            data: stores
        });
    } catch (error) {
        next(error);
    }
};

// GET STORE BY ID
exports.getStoreById = async (req, res, next) => {
    try {
        const store = await Store.findById(req.params.id);

        if (!store) {
            return res.status(404).json({
                status: false,
                message: 'Cửa hàng không tìm thấy'
            });
        }

        res.status(200).json({
            status: true,
            data: store
        });
    } catch (error) {
        next(error);
    }
};

// CREATE STORE (ADMIN)
exports.createStore = async (req, res, next) => {
    try {
        const { name, address, phone } = req.body;

        if (!name || !address || !phone) {
            return res.status(400).json({
                status: false,
                message: 'Vui lòng điền đầy đủ thông tin bắt buộc'
            });
        }

        const store = await Store.create({
            name,
            address,
            phone,
            phone
        });

        res.status(201).json({
            status: true,
            message: 'Tạo cửa hàng thành công',
            data: store
        });
    } catch (error) {
        next(error);
    }
};

// UPDATE STORE (ADMIN)
exports.updateStore = async (req, res, next) => {
    try {
        const store = await Store.findByIdAndUpdate(
            req.params.id,
            { ...req.body, updatedAt: new Date() },
            { new: true, runValidators: true }
        );

        if (!store) {
            return res.status(404).json({
                status: false,
                message: 'Cửa hàng không tìm thấy'
            });
        }

        res.status(200).json({
            status: true,
            message: 'Cập nhật cửa hàng thành công',
            data: store
        });
    } catch (error) {
        next(error);
    }
};

// DELETE STORE (ADMIN)
exports.deleteStore = async (req, res, next) => {
    try {
        const store = await Store.findById(req.params.id);

        if (!store) {
            return res.status(404).json({
                status: false,
                message: 'Cửa hàng không tìm thấy'
            });
        }

        store.isActive = false;
        await store.save();

        res.status(200).json({
            status: true,
            message: 'Xóa cửa hàng thành công'
        });
    } catch (error) {
        next(error);
    }
};
