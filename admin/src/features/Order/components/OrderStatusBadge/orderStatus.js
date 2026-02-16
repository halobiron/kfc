export const ORDER_STATUS = {
    PENDING: 'Chờ xác nhận',
    CONFIRMED: 'Đã xác nhận',
    PREPARING: 'Đang chuẩn bị',
    READY: 'Sẵn sàng',
    SHIPPING: 'Đang giao hàng',
    DELIVERED: 'Đã giao hàng',
    CANCELLED: 'Đã hủy',
};

export const ORDER_STATUS_META = {
    'Chờ xác nhận': { label: 'Chờ xác nhận', badgeVariant: 'warning', icon: 'bi-clock' },
    'Đã xác nhận': { label: 'Đã xác nhận', badgeVariant: 'info', icon: 'bi-check2-circle' },
    'Đang chuẩn bị': { label: 'Đang chuẩn bị', badgeVariant: 'info', icon: 'bi-egg-fried' },
    'Sẵn sàng': { label: 'Sẵn sàng giao', badgeVariant: 'success', icon: 'bi-check-circle' },
    'Đang giao hàng': { label: 'Đang giao hàng', badgeVariant: 'primary', icon: 'bi-truck' },
    'Đã giao hàng': { label: 'Hoàn thành', badgeVariant: 'success', icon: 'bi-check-all' },
    'Đã hủy': { label: 'Đã hủy', badgeVariant: 'danger', icon: 'bi-x-circle' }
};

export const getOrderStatusMeta = (status) =>
    ORDER_STATUS_META[status] || { label: status, badgeVariant: 'secondary', icon: 'bi-question-circle' };
