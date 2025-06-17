const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { Op } = require('sequelize');

const userService = {
    login: async (username, password) => {
        try {
            const user = await User.findOne({ where: { username } });
            if (!user || !(await bcrypt.compare(password, user.hash_password))) {
                throw new Error('Неверные данные');
            }
            const accessToken = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
            const refreshToken = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '7d' });
            await user.update({ access_token: accessToken, refresh_token: refreshToken });
            return { accessToken, refreshToken, user };
        } catch (err) {
            console.error('Error in login:', err);
            throw err;
        }
    },

    loginWithOneTimeToken: async (oneTimeToken) => {
        try {
            const user = await User.findOne({
                where: {
                    one_time_token: oneTimeToken,
                    one_time_token_expires: { [Op.gt]: new Date() }
                }
            });
            if (!user) {
                throw new Error('Недействительный или истёкший токен');
            }
            const accessToken = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
            const refreshToken = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '7d' });

            await user.update({
                access_token: accessToken,
                refresh_token: refreshToken,
                one_time_token: null,
                one_time_token_expires: null
            });
            return { accessToken, refreshToken, user };
        } catch (err) {
            console.error('Error in login with one time token:', err);
            throw err;
        }
    }
};

module.exports = userService;