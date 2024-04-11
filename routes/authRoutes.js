// =================================================================
// FOR SIGN UP LOGIN
// We export the controller like handleError, signup_get, login_get, etc
// Cleaner Code View

const { Router } = require('express');
const authController = require('../controllers/authController.js');

const router = Router()

router.get('/signup', authController.signup_get);

router.post('/signup', authController.signup_post);

router.get('/login', authController.login_get);

router.post('/login', authController.login_post);

router.get('/logout', authController.logout_get);

module.exports = router;