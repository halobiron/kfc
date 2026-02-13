export const formatCurrency = (amount, options = {}) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        ...options
    }).format(amount);
};
