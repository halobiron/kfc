const Log = require('../models/logSchema');

const logAction = async (userId, action, resource, details) => {
    try {
        if (!userId) return;

        const newLog = new Log({
            user: userId,
            action,
            resource,
            details
        });

        await newLog.save();
    } catch (error) {
        console.error('Lỗi khi ghi log thao tác:', error);
    }
};

module.exports = { logAction };
