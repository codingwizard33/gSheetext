const Router = require('express').Router;
const router = new Router();

const indexController = require('../controllers/indexController');
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/login', userController.login);
router.post('/connect', userController.connect);

router.post('/logout', userController.logout);
router.post('/get-users', authMiddleware, indexController.getUsers);
router.post('/update-user', authMiddleware, indexController.updateUser);

module.exports = router;