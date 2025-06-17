const { Todo, User } = require('../models');
const bcrypt = require('bcrypt');

const todoService = {
    getTodos: async () => {
        try {
            const todos = await Todo.findAll({
                include: [{
                    model: User,
                    attributes: ['username', 'is_blocked'],
                    required: false
                }]
            });
            console.log('Fetched todos:', todos.map(t => ({ id: t.id, user_id: t.user_id, username: t.User ? t.User.username : null })));
            return todos;
        } catch (err) {
            console.error('Error fetching todos:', err);
            throw err;
        }
    },

    addTodo: async (text, userId) => {
        try {
            if (!userId) {
                console.error('No userId provided for addTodo');
                throw new Error('User ID is required');
            }
            const user = await User.findByPk(userId);
            if (!user) {
                console.error(`User with id ${userId} not found`);
                throw new Error('User not found');
            }
            const todo = await Todo.create({ text, user_id: userId });
            console.log('Created todo:', { id: todo.id, text, user_id: userId });
            return todo;
        } catch (err) {
            console.error('Error adding todo:', err);
            throw err;
        }
    },

    updateTodo: async (id, text, userId) => {
        try {
            if (!userId) {
                console.error('No userId provided for updateTodo');
                throw new Error('User ID is required');
            }
            const user = await User.findByPk(userId);
            if (!user) {
                throw new Error('User not found');
            }
            const isAdmin = userId === process.env.ADMIN_CHAT_ID && await bcrypt.compare(process.env.ADMIN_PASSWORD, user.hash_password);
            const whereClause = isAdmin ? { id } : { id, user_id: userId };
            const [updated] = await Todo.update({ text }, { where: whereClause });
            if (updated) {
                const todo = await Todo.findByPk(id);
                console.log('Updated todo:', { id, text, user_id: userId });
                return todo;
            }
            return null;
        } catch (err) {
            console.error('Error updating todo:', err);
            throw err;
        }
    },

    deleteTodo: async (id, userId) => {
        try {
            if (!userId) {
                console.error('No userId provided for deleteTodo');
                throw new Error('User ID is required');
            }
            const user = await User.findByPk(userId);
            if (!user) {
                throw new Error('User not found');
            }
            const isAdmin = userId === process.env.ADMIN_CHAT_ID && await bcrypt.compare(process.env.ADMIN_PASSWORD, user.hash_password);
            const whereClause = isAdmin ? { id } : { id, user_id: userId };
            const deleted = await Todo.destroy({ where: whereClause });
            console.log('Deleted todo:', { id, user_id: userId, deleted });
            return deleted > 0;
        } catch (err) {
            console.error('Error deleting todo:', err);
            throw err;
        }
    },

    isAdmin: async (userId) => {
        try {
            const user = await User.findByPk(userId);
            if (!user) return false;
            return userId === process.env.ADMIN_CHAT_ID && await bcrypt.compare(process.env.ADMIN_PASSWORD, user.hash_password);
        } catch (err) {
            console.error('Error checking admin status:', err);
            return false;
        }
    }
};

module.exports = todoService;