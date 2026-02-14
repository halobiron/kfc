export const RESOURCES = [
    { id: 'dashboard', label: 'Tổng quan' },
    { id: 'orders', label: 'Đơn hàng' },
    { id: 'kitchen', label: 'Bếp' },
    { id: 'products', label: 'Sản phẩm' },
    { id: 'categories', label: 'Danh mục' },
    { id: 'ingredients', label: 'Nguyên liệu' },
    { id: 'users', label: 'Người dùng' },
    { id: 'roles', label: 'Phân quyền' },
    { id: 'promotions', label: 'Khuyến mãi' },
    { id: 'reports', label: 'Báo cáo' },
    { id: 'stores', label: 'Cửa hàng' }
];

export const ROLE_DEFINITIONS = {
    admin: { name: 'Quản trị viên', desc: 'Quản trị viên với toàn quyền truy cập' },
    staff: { name: 'Nhân viên', desc: 'Nhân viên cửa hàng' },
    customer: { name: 'Khách hàng', desc: 'Khách hàng thường' },
    cashier: { name: 'Thu ngân', desc: 'Nhân viên thu ngân' },
    kitchen: { name: 'Bếp', desc: 'Nhân viên bếp' },
    delivery: { name: 'Giao hàng', desc: 'Nhân viên giao hàng' }
};
