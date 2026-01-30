const jwt = require('jsonwebtoken');

exports.isAuthenticatedUser = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.token) {
        token = req.cookies.token;
    }

    if (!token) {
        return res.status(401).json({
            status: false,
            message: 'Vui lòng đăng nhập để tiếp tục'
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            status: false,
            message: 'Token không hợp lệ hoặc đã hết hạn'
        });
    }
};

exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                status: false,
                message: `Chỉ có ${roles.join(', ')} mới có quyền truy cập`
            });
        }
        next();
    };
};
