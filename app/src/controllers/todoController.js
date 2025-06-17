const todoService = require('../services/todoService');

const todoController = {
    renderHome: async (req, res) => {
        try {
            if (!req.user) {
                return res.render('login', { error: null });
            }
            const todos = await todoService.getTodos();
            const isAdmin = await todoService.isAdmin(req.user?.id);
            res.render('index', { todos, user: req.user, isAdmin });
        } catch (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
        }
    },

    getTodosHandle: async (req, res) => {
        try {
            const todos = await todoService.getTodos();
            res.status(200).json(todos);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    addTodoHandle: async (req, res) => {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'Авторизация требуется' });
            }
            const { text } = req.body;
            if (!text) {
                return res.status(400).json({ error: 'Текст обязателен' });
            }
            await todoService.addTodo(text, req.user.id);
            res.status(201).json({ message: 'Задача добавлена' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Ошибка сервера' });
        }
    },

    updateTodoHandler: async (req, res) => {
        try {
            const { id } = req.params;
            const { text } = req.body;
            if (!text) {
                return res.status(400).json({ error: 'Текст обязателен' });
            }
            const updated = await todoService.updateTodo(id, text, req.user?.id);
            if (!updated) {
                return res.status(404).json({ error: 'Задача не найдена или доступ запрещён' });
            }
            res.status(200).json({ message: 'Задача обновлена' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Ошибка сервера' });
        }
    },

    deleteTodoHandler: async (req, res) => {
        try {
            const { id } = req.params;
            const deleted = await todoService.deleteTodo(id, req.user?.id);
            if (!deleted) {
                return res.status(404).json({ error: 'Задача не найдена или доступ запрещён' });
            }
            res.status(200).json({ message: 'Задача удалена' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Ошибка сервера' });
        }
    }
};

module.exports = todoController;