const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todoController');
const userController = require("../controllers/userController");

router.get('/todos', todoController.getTodosHandle);
router.post('/todos', todoController.addTodoHandle);
router.put('/todos/:id', todoController.updateTodoHandler);
router.delete('/todos/:id', todoController.deleteTodoHandler);
router.post('/login', userController.loginHandle);

module.exports = router;