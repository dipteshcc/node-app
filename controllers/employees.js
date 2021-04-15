const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const Emp = require('../models/employees');
const User = require('../models/user');

// this method is used to fetch the details of every employees
exports.getEmps = (req, res, next) => {
  Emp.find()
    .then(count => {
      return Emp.find()
    })
    .then(Emps => {
      res.status(200).json({
        message: 'Fetched Emps successfully.',
        Emps: Emps
      });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};


//this method is used to create a new employee
exports.createEmp = (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  let creator;
  bcrypt
    .hash(password, 12)
    .then(hashedPw => {
  const employee = new Emp({
    name: name,
    email: email,
    password: hashedPw,
    creator: req.userId
  });

  employee
    .save()
    .then(result => {
      return User.findById(req.userId);
    })
    .then(user => {
      creator = user;
      user.Emps.push(employee);
      return user.save();
    })
    .then(result => {
      res.status(201).json({
        message: 'Employee created successfully!',
        Emp: employee,
        creator: {
          _id: creator._id,
          name: creator.name
        }
      });
    })
  })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};


//this method is used to fetch the details of a specific employee, need empID on param
exports.getEmp = (req, res, next) => {
  const EmpId = req.params.employeID;
  Emp.findById(EmpId)
    .then(Emp => {
      if (!Emp) {
        const error = new Error('Could not find Emp.');
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({
        message: 'Emp fetched.',
        Emp: Emp
      });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};


//this method is used to update any employee, payload(employee details) 
exports.updateEmp = (req, res, next) => {
  const EmpId = req.params.employeID;
  const name = req.body.name;
  const email = req.body.email;
  let password = req.body.password;

  Emp.findById(EmpId)
    .then(Empz => {
      if (!Empz) {
        const error = new Error('Could not find Emp.');
        error.statusCode = 404;
        throw error;
      }
      if (Empz.creator.toString() !== req.userId) {
        const error = new Error('Not authorized!');
        error.statusCode = 403;
        throw error;
      }
      bcrypt
        .hash(password, 12)
        .then(hashedPw => {
          Empz.name = name;
          Empz.email = email;
          Empz.password = hashedPw;
          return Empz.save();
        })
    })
    .then(result => {
      res.status(200).json({
        message: 'Employee updated!',
        Emp: result
      });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

//this method is used for deleting employees
exports.deleteEmp = (req, res, next) => {
  const EmpId = req.params.employeID;
  Emp.findById(EmpId)
    .then(Empz => {
      if (!Empz) {
        const error = new Error('Could not find Emp.');
        error.statusCode = 404;
        throw error;
      }
      // Check logged in user, only creator can delete
      if (Empz.creator.toString() !== req.userId) {
        const error = new Error('Not authorized!');
        error.statusCode = 403;
        throw error;
      }
      return Emp.findByIdAndRemove(EmpId);
    })
    .then(result => {
      return User.findById(req.userId);
    })
    .then(user => {
      user.Emps.pull(EmpId);
      return user.save();
    })
    .then(result => {
      res.status(200).json({
        message: 'Deleted Employee.'
      });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};