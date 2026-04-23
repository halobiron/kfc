
// Template email đặt lại mật khẩu
const resetPasswordTemplate = (name, resetUrl) => {
    return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #e4002b;">Đặt lại mật khẩu KFC</h2>
            <p>Xin chào ${name},</p>
            <p>Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản KFC của mình.</p>
            <p>Vui lòng nhấp vào nút bên dưới để đặt lại mật khẩu:</p>
            <div style="text-align: center; margin: 30px 0;">
                <a href="${resetUrl}" style="background-color: #e4002b; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Đặt lại mật khẩu</a>
            </div>
            <p>Hoặc sao chép và dán liên kết sau vào trình duyệt của bạn:</p>
            <p style="color: #666; word-break: break-all;">${resetUrl}</p>
            <p style="color: #999; font-size: 12px; margin-top: 30px;">
                Link này sẽ hết hạn sau 10 phút.<br>
                Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.
            </p>
        </div>
    `;
};

// Template email thông báo VIP
const vipAnnouncementTemplate = (name, discount) => {
    return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
            <div style="background-color: #e4002b; padding: 20px; text-align: center;">
                <h1 style="color: white; margin: 0;">CHÚC MỪNG VIP! 👑</h1>
            </div>
            <div style="padding: 30px; line-height: 1.6; color: #333;">
                <p>Xin chào <strong>${name}</strong>,</p>
                <p>KFC Vietnam xin trân trọng thông báo: Tài khoản của bạn đã chính thức được nâng cấp lên hạng <strong>VIP Member</strong>!</p>
                <div style="background-color: #f9f9f9; border-left: 4px solid #e4002b; padding: 15px; margin: 20px 0;">
                    <p style="margin: 0;">🎁 Quyền lợi của bạn: <strong>Giảm giá trực tiếp ${discount}%</strong> cho mọi đơn hàng đặt trực tuyến.</p>
                </div>
                <p>Ưu đãi này đã được kích hoạt và sẽ tự động áp dụng khi bạn đăng nhập và đặt hàng tại website.</p>
                <p>Cảm ơn bạn đã luôn đồng hành và ủng hộ KFC. Chúc bạn có những bữa ăn ngon miệng!</p>
                <div style="text-align: center; margin-top: 30px;">
                    <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}" style="background-color: #e4002b; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">ĐẶT HÀNG NGAY</a>
                </div>
            </div>
            <div style="background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 12px; color: #999;">
                <p style="margin: 0;">&copy; 2024 KFC Vietnam. All rights reserved.</p>
            </div>
        </div>
    `;
};

module.exports = {
    resetPasswordTemplate,
    vipAnnouncementTemplate
};
