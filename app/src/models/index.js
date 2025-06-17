const sequelize = require('../db/db');
const Todo = require('./todo');
const User = require('./user');

Todo.belongsTo(User, { foreignKey: 'user_id', targetKey: 'id' });
User.hasMany(Todo, { foreignKey: 'user_id', sourceKey: 'id' });

module.exports = { sequelize, Todo, User };