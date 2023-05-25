const Router = require('express').Router;
const userController = require('../controllers/user-controller');
const router = new Router();
const { body } = require('express-validator');
const authMiddleware = require('../middlewares/auth-middleware');

router.post('/registration',
    body('email').isEmail(),
    body('password').isLength({min: 1}),
    userController.registration);
router.post('/login', userController.login);
router.post('/logout', authMiddleware, userController.logout);
router.get('/refresh', userController.refresh);
router.get('/users', authMiddleware, userController.getUsers);
router.post('/block', authMiddleware, userController.blockUsers);
router.post('/unblock', authMiddleware, userController.unblockUsers);
router.post('/delete', authMiddleware, userController.deleteUsers);

module.exports = router;