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


exports.authorizePermission = (...permissions) => {
    return (req, res, next) => {
        if (!req.user || !req.user.role) {
            return res.status(403).json({
                status: false,
                message: 'Bạn không có quyền truy cập'
            });
        }

        const userRole = req.user.role.toUpperCase();

        // Admin always has full access
        if (userRole === 'ADMIN') {
            return next();
        }

        // Check permissions from token payload
        const userPermissions = req.user.permissions || [];
        const hasPermission = permissions.some(permission => userPermissions.includes(permission));

        if (hasPermission) {
            return next();
        }

        return res.status(403).json({
            status: false,
            message: `Bạn không có quyền thực hiện hành động này. Cần một trong các quyền: ${permissions.join(', ')}`
        });
    };
};

exports.getUserFromToken = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.token) {
        token = req.cookies.token;
    }

    if (!token) {
        return next();
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
    } catch (error) {
        // Just ignore invalid token for optional auth
    }
    next();
};
