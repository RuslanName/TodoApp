const { DataTypes } = require('sequelize');
const sequelize = require('../db/db');

const User = sequelize.define('users_data', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: true
    },
    first_name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    hash_password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    access_token: {
        type: DataTypes.STRING,
        allowNull: true
    },
    refresh_token: {
        type: DataTypes.STRING,
        allowNull: true
    },
    is_blocked: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    one_time_token: {
        type: DataTypes.STRING,
        allowNull: true
    },
    one_time_token_expires: {
        type: DataTypes.DATE,
        allowNull: true
    }
});

module.exports = User;