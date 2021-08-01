const express = require('express');
const router = express.Router();
const User = require('../models/users');
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const users = require('../controllers/users');

router.route('/register')
      .get(users.formRegister)
      .post(catchAsync(users.postRegister))

router.route('/login')
      .get(users.formLogin)
      .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), catchAsync(users.postLogin))

router.get('/logout', users.logout)


module.exports = router;
