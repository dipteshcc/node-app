const express = require('express');
const validator = require('../validator/validate');
const validationChecker = require('../helper/validation_handler').checkValidations;
const empController = require('../controllers/employees');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

console.log("Inside employee js file");

// GET all the Employees
router.get('/all', isAuth, empController.getEmps);

// Create new Employee
router.post('/create', isAuth, validator.validate("createEmp"), validationChecker, empController.createEmp );

//Fetch a specific Employee by his/her ID
router.get('/:employeID', isAuth, empController.getEmp);

//Update an Employee
router.put('/:employeID',isAuth, validator.validate("updateEmp"), validationChecker, empController.updateEmp);

//Delete an Employee
router.delete('/:employeID', isAuth, empController.deleteEmp);

module.exports = router;
