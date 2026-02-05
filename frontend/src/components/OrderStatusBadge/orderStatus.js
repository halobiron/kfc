export const ORDER_STATUS = {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    PREPARING: 'preparing',
    SHIPPING: 'shipping',
    READY: 'ready',
    DELIVERED: 'delivered',
    CANCELLED: 'cancelled',
};

export const STATUS_CONFIG = {
    [ORDER_STATUS.PENDING]: {
        text: 'Chờ xác nhận',
        class: 'status-pending',
        icon: 'bi-clock'
    },
    [ORDER_STATUS.CONFIRMED]: {
        text: 'Đã xác nhận',
        class: 'status-confirmed',
        icon: 'bi-check2-circle'
    },
    [ORDER_STATUS.PREPARING]: {
        text: 'Đang chuẩn bị',
        class: 'status-preparing',
        icon: 'bi-egg-fried'
    },
    [ORDER_STATUS.SHIPPING]: {
        text: 'Đang giao hàng',
        class: 'status-shipping',
        icon: 'bi-truck'
    },
    [ORDER_STATUS.READY]: {
        text: 'Sẵn sàng giao',
        class: 'status-ready',
        icon: 'bi-check-circle'
    },
    [ORDER_STATUS.DELIVERED]: {
        text: 'Đã giao hàng',
        class: 'status-delivered',
        icon: 'bi-check-all'
    },
    [ORDER_STATUS.CANCELLED]: {
        text: 'Đã hủy',
        class: 'status-cancelled',
        icon: 'bi-x-circle'
    }
};

export const STATUS_OPTIONS = [
    { value: 'All', label: 'Tất cả trạng thái' },
    { value: ORDER_STATUS.PENDING, label: STATUS_CONFIG[ORDER_STATUS.PENDING].text },
    { value: ORDER_STATUS.CONFIRMED, label: STATUS_CONFIG[ORDER_STATUS.CONFIRMED].text },
    { value: ORDER_STATUS.PREPARING, label: STATUS_CONFIG[ORDER_STATUS.PREPARING].text },
    { value: ORDER_STATUS.READY, label: STATUS_CONFIG[ORDER_STATUS.READY].text },
    { value: ORDER_STATUS.SHIPPING, label: STATUS_CONFIG[ORDER_STATUS.SHIPPING].text },
    { value: ORDER_STATUS.DELIVERED, label: 'Hoàn thành' },
    { value: ORDER_STATUS.CANCELLED, label: STATUS_CONFIG[ORDER_STATUS.CANCELLED].text }
];
