export const ORDER_STATUS_META = {
    pending: { label: 'Chờ xác nhận', badgeVariant: 'warning', icon: 'bi-clock' },
    confirmed: { label: 'Đã xác nhận', badgeVariant: 'info', icon: 'bi-check2-circle' },
    preparing: { label: 'Đang chuẩn bị', badgeVariant: 'info', icon: 'bi-egg-fried' },
    ready: { label: 'Sẵn sàng giao', badgeVariant: 'success', icon: 'bi-check-circle' },
    shipping: { label: 'Đang giao hàng', badgeVariant: 'primary', icon: 'bi-truck' },
    delivered: { label: 'Hoàn thành', badgeVariant: 'success', icon: 'bi-check-all' },
    cancelled: { label: 'Đã hủy', badgeVariant: 'danger', icon: 'bi-x-circle' }
};

export const getOrderStatusMeta = (status) =>
    ORDER_STATUS_META[status] || { label: status, badgeVariant: 'secondary', icon: 'bi-question-circle' };
