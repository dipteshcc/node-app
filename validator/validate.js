const {
    body
} = require('express-validator/check');
const User = require('../models/user');
const Employees = require('../models/employees');

exports.validate = (method) => {
    switch (method) {
        case 'createEmp': {
            return [
                body('name', 'Name is required').not().isEmpty(),
                body('email')
                .isEmail()
                .withMessage('Please enter a valid email.')
                .custom((value, {
                  req
                }) => {
                  return Employees.findOne({
                    email: value
                  }).then(empDoc => {
                    if (empDoc) {
                      return Promise.reject('E-Mail address already exists! Please provide a different email');
                    }
                  });
                })
                .normalizeEmail(),

                body('password', 'Initial Password is required').not().isEmpty(),
            ];
        }
        case 'updateEmp': {
            return [
                body('name', 'Name is required').not().isEmpty(),
                body('email')
                .isEmail()
                .withMessage('Please enter a valid email.')
                .custom((value, {
                  req
                }) => {
                  return Employees.findOne({
                    email: value
                  }).then(empDoc => {
                    if (empDoc) {
                      return Promise.reject('Update with this email failed! Please provide a different email');
                    }
                  });
                })
                .normalizeEmail(),
                body('password', 'Initial Password is required').not().isEmpty(),
            ];
        }
        case 'signup': {
            return [
                body('email')
                .isEmail()
                .withMessage('Please enter a valid email.')
                .custom((value, {
                  req
                }) => {
                  return User.findOne({
                    email: value
                  }).then(userDoc => {
                    if (userDoc) {
                      return Promise.reject('E-Mail address already exists!');
                    }
                  });
                })
                .normalizeEmail(),
                body('password')
                .trim()
                .isLength({
                    min: 5
                }),
                body('name')
                .trim()
                .not()
                .isEmpty()
            ];
        }
        case 'login': {
            return [
                body('email', 'Email is required').not().isEmpty(),
                body('email', 'Valid email is required.').isEmail(),
                body('password', 'Password is required').not().isEmpty(),
            ];
        }
        case 'updateUserStatus': {
            return [
                body('status', 'status is required').not().isEmpty(),
            ];
        }

    }
};