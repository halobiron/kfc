const { getShippingConfig } = require('../utils/shipping');

exports.getShippingConfig = (req, res) => {
    const config = getShippingConfig();
    res.status(200).json({
        status: true,
        data: config
    });
};
