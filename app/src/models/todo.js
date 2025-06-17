const { DataTypes } = require('sequelize');
const sequelize = require('../db/db');

const Todo = sequelize.define('todos_data', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    text: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    user_id: {
        type: DataTypes.STRING,
        allowNull: true,
        references: {
            model: 'users_data',
            key: 'id'
        }
    }
});

module.exports = Todo;