const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todoController')
const userController = require('../controllers/userController');

router.get('/', (req, res) => {
    if (req.user) {
        todoController.renderHome(req, res);
    } else {
        res.render('login', { error: null });
    }
});

router.get('/register', userController.registerRedirect);
router.get('/auto-login', userController.autoLoginHandle);

module.exports = router;