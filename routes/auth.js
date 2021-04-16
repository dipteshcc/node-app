const express = require('express');
const validator = require('../validator/validate');
const validationChecker = require('../helper/validation_handler').checkValidations;
const User = require('../models/user');
const authController = require('../controllers/auth');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.post('/signup', validator.validate("signup"), validationChecker, authController.signup);

router.post('/login', validator.validate("login"), validationChecker,  authController.login);

router.get('/status', isAuth, authController.getUserStatus);

router.patch('/status', isAuth, validator.validate("updateUserStatus"), validationChecker, authController.updateUserStatus);

module.exports = router;
