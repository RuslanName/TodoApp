const { User } = require('../models');

const blockCheckMiddleware = async (req, res, next) => {
    if (req.user) {
        try {
            const user = await User.findByPk(req.user.id);
            if (user && user.is_blocked) {
                res.clearCookie('accessToken');
                res.clearCookie('refreshToken');
                return res.status(403).render('login', { error: 'Ваш аккаунт заблокирован' });
            }
        } catch (err) {
            console.error('Error checking block status:', err);
            return res.status(500).send('Internal Server Error');
        }
    }
    next();
};

module.exports = blockCheckMiddleware;