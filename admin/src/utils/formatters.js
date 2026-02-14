export const formatCurrency = (amount, options = {}) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        ...options
    }).format(amount);
};

const DATE_LOCALE = 'vi-VN';

const toValidDate = (value) => {
    if (value === null || value === undefined || value === '') return null;
    const date = value instanceof Date ? value : new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
};

export const formatDate = (value, fallback = '') => {
    const date = toValidDate(value);
    if (!date) return fallback;
    return date.toLocaleDateString(DATE_LOCALE);
};

export const formatDateTime = (value, fallback = '') => {
    const date = toValidDate(value);
    if (!date) return fallback;

    return date.toLocaleString(DATE_LOCALE, {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
};
