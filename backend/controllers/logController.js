const Log = require('../models/logSchema');
const { catchAsyncErrors } = require('../middleware/errors');

// Lấy danh sách logs => /api/v1/logs
exports.getLogs = catchAsyncErrors(async (req, res, next) => {
    const resPerPage = 20;
    const page = Number(req.query.page) || 1;

    // Lọc theo resource hoặc action nếu có
    const filter = {};
    if (req.query.resource) filter.resource = req.query.resource;
    if (req.query.action) filter.action = req.query.action;

    const logCount = await Log.countDocuments(filter);

    const logs = await Log.find(filter)
        .populate('user', 'name email role')
        .sort({ createdAt: -1 })
        .skip(resPerPage * (page - 1))
        .limit(resPerPage);

    res.status(200).json({
        success: true,
        logCount,
        resPerPage,
        page,
        logs
    });
});

// Lưu log GPS => /api/v1/logs/gps
exports.createGPSLog = catchAsyncErrors(async (req, res, next) => {
    const { lat, lng, address } = req.body;

    const log = await Log.create({
        user: req.user.id,
        action: 'GPS_LOG',
        resource: 'Stores',
        details: `Vị trí: ${address || 'Không rõ'} [${lat}, ${lng}]`
    });

    res.status(201).json({
        success: true,
        log
    });
});
