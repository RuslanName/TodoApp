const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.cookies.accessToken;
    if (token) {
        try {
            req.user = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            console.error('Invalid or expired token:', err.message);
            res.clearCookie('accessToken');
            res.clearCookie('refreshToken');
        }
    }
    next();
};

module.exports = authMiddleware;