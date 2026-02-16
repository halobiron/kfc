export const ORDER_STATUS = {
    PENDING: 'Chờ xác nhận',
    CONFIRMED: 'Đã xác nhận',
    PREPARING: 'Đang chuẩn bị',
    SHIPPING: 'Đang giao hàng',
    READY: 'Sẵn sàng',
    DELIVERED: 'Đã giao hàng',
    CANCELLED: 'Đã hủy',
};

const STATUS_DEFINITIONS = [
    { value: ORDER_STATUS.PENDING, text: 'Chờ xác nhận', class: 'status-pending', icon: 'bi-clock' },
    { value: ORDER_STATUS.CONFIRMED, text: 'Đã xác nhận', class: 'status-confirmed', icon: 'bi-check2-circle' },
    { value: ORDER_STATUS.PREPARING, text: 'Đang chuẩn bị', class: 'status-preparing', icon: 'bi-egg-fried' },
    { value: ORDER_STATUS.SHIPPING, text: 'Đang giao hàng', class: 'status-shipping', icon: 'bi-truck' },
    { value: ORDER_STATUS.READY, text: 'Sẵn sàng giao', class: 'status-ready', icon: 'bi-check-circle' },
    { value: ORDER_STATUS.DELIVERED, text: 'Đã giao hàng', class: 'status-delivered', icon: 'bi-check-all', optionLabel: 'Hoàn thành' },
    { value: ORDER_STATUS.CANCELLED, text: 'Đã hủy', class: 'status-cancelled', icon: 'bi-x-circle' }
];

export const STATUS_CONFIG = Object.fromEntries(
    STATUS_DEFINITIONS.map(({ value, text, class: className, icon }) => [
        value,
        { text, class: className, icon }
    ])
);

export const STATUS_OPTIONS = [
    { value: 'All', label: 'Tất cả trạng thái' },
    ...STATUS_DEFINITIONS.map(({ value, text, optionLabel }) => ({
        value,
        label: optionLabel || text
    }))
];
