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
        // Check if role is object (new) or string (old)
        const userRole = req.user.role && req.user.role.name ? req.user.role.name : req.user.role;

        if (!roles.includes(userRole)) {
            return res.status(403).json({
                status: false,
                message: `Chỉ có ${roles.join(', ')} mới có quyền truy cập`
            });
        }
        next();
    };
};

exports.authorizePermission = (permission) => {
    return (req, res, next) => {
        const userRole = req.user.role; // This is the populated role object from authController.getCurrentUser / login
        const roleName = userRole?.name || userRole; // Handle if it's just a string string (legacy)

        // Admin always has access
        if (roleName === 'admin') {
            return next();
        }

        const userPermissions = userRole?.permissions || [];

        if (userPermissions.includes(permission)) {
            return next();
        }

        return res.status(403).json({
            status: false,
            message: `Bạn không có quyền thực hiện hành động này. Cần quyền: ${permission}`
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
