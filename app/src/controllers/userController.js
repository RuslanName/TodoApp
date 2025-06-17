const userService = require('../services/userService');

const userController = {
    loginHandle: async (req, res) => {
        try {
            const { username, password } = req.body;
            const { accessToken, refreshToken } = await userService.login(username, password);
            res.cookie('accessToken', accessToken, { httpOnly: true, maxAge: 3600000 });
            res.cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: 7 * 24 * 3600000 });
            res.redirect('/');
        } catch (err) {
            console.error(err);
            res.render('login', { error: err.message || 'Ошибка сервера' });
        }
    },

    autoLoginHandle: async (req, res) => {
        try {
            const { oneTimeToken } = req.query;
            if (!oneTimeToken) {
                return res.render('login', { error: 'Токен отсутствует' });
            }
            const { accessToken, refreshToken } = await userService.loginWithOneTimeToken(oneTimeToken);
            res.cookie('accessToken', accessToken, { httpOnly: true, maxAge: 3600000 });
            res.cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: 7 * 24 * 3600000 });
            res.redirect('/');
        } catch (err) {
            console.error(err);
            res.render('login', { error: err.message || 'Ошибка сервера' });
        }
    },

    registerRedirect: (req, res) => {
        res.redirect(`https://t.me/${process.env.BOT_NAME}`);
    }
};

module.exports = userController;