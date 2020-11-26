const express = require('express');
const { check, validationResult } = require('express-validator');

const usersRepo = require('../../repositories/users');
const signupTemplate = require('../../views/admin/auth/signup');
const signinTemplate = require('../../views/admin/auth/signin');
const {
  requireEmail,
  requirePassword,
  requirePasswordConfirmation,
  requireEmailExists,
  requireValidPasswordForUser
} = require('./validators');

const router = express.Router();

router.get('/signup', (req, res) => {
  res.send(signupTemplate({ req }));

});
//post request handler
router.post(
  '/signup',
  [requireEmail, requirePassword, requirePasswordConfirmation],
  async (req, res) => {
    const errors = validationResult(req);
    //console.log(errors);
    if (!errors.isEmpty()) {
      return res.send(signupTemplate({ req, errors }));
    }

    const { email, password, passwordConfirmation } = req.body;
    const user = await usersRepo.create({ email, password });

    req.session.userId = user.id;
    res.send('Account created!!!');

  });
// get request handler 
// sign out-- tell the server to forget the cookies
router.get('/signout', (req, res) => {
  req.session = null;
  res.send('You are logged out');
});

//show only sign in form to user--user to server
router.get('/signin', (req, res) => {
  res.send(signinTemplate({}))
});
//server side to user--sign in 
router.post(
  '/signin',
  [requireEmailExists, requireValidPasswordForUser],
  async (req, res) => {
    const errors = validationResult(req);
    //console.log(errors);
    if (!errors.isEmpty()) {
      return res.send(signupTemplate({ errors }));
    }
    const { email } = req.body;

    const user = await usersRepo.getOneBy({ email });

    req.session.userId = user.id;
    
    res.send('You are signed in!!!')
  });

module.exports = router;