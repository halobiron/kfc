export const DEFAULT_SHIPPING_CONFIG = {
    freeShippingThreshold: 200000,
    shippingFee: 15000,
    pickupFee: 0
};

export const calculateDeliveryFee = ({ subtotal, deliveryType, config }) => {
    if (deliveryType === 'pickup') return config.pickupFee;
    if (subtotal >= config.freeShippingThreshold) return 0;
    return config.shippingFee;
};
