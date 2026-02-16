
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

module.exports = {
    resetPasswordTemplate
};
