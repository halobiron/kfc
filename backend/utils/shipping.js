const toNonNegativeInt = (value, fallback) => {
    const parsed = Number.parseInt(value, 10);
    if (Number.isNaN(parsed) || parsed < 0) return fallback;
    return parsed;
};

const getShippingConfig = () => {
    const freeShippingThreshold = toNonNegativeInt(process.env.SHIPPING_FREE_THRESHOLD, 200000);
    const shippingFee = toNonNegativeInt(process.env.SHIPPING_FEE, 15000);
    const pickupFee = toNonNegativeInt(process.env.PICKUP_FEE, 0);

    return {
        freeShippingThreshold,
        shippingFee,
        pickupFee
    };
};

const calculateShippingFee = ({ deliveryType, subtotal }) => {
    const { freeShippingThreshold, shippingFee, pickupFee } = getShippingConfig();

    if (deliveryType === 'pickup') return pickupFee;
    if (subtotal >= freeShippingThreshold) return 0;
    return shippingFee;
};

module.exports = {
    getShippingConfig,
    calculateShippingFee
};
