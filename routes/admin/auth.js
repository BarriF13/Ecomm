const express = require('express');
const usersRepo = require('../../repositories/users');
const signupTemplate = require('../../views/admin/auth/signup');

const signinTemplate = require('../../views/admin/auth/signin');

const router = express.Router();

router.get('/signup', (req, res) => {
  res.send(signupTemplate({ req }));

});

router.post('/signup', async (req, res) => {
  const { email, password, passwordConfirmation } = req.body;

  const existingUser = await usersRepo.getOneBy({ email: email });
  if (existingUser) {
    return res.send('Email has been already registered')
  }

  if (password !== passwordConfirmation) {
    return res.send('Passwords do not match')
  }
  //Create a user in our user repo to represent this person
  const user = await usersRepo.create({ email: email, password: password });
  //Store the id of that user inside the users cookie
  //req.session === {}//Added by cookie session.-it's an object

  req.session.userId = user.id;
  res.send('Account created!');


});

// sign out-- tell the server to forget the cookies
router.get('/signout', ( req, res)=>{
  req.session = null;
  res.send('You are logged out');
});

//show only sign in form to user--user to server f
router.get('/signin', (req, res)=>{
  res.send(signinTemplate())
});
//server side to user
router.post('/signin', async (req, res)=>{
  const {email, password} = req.body;

  const user = await usersRepo.getOneBy({email: email});
  if(!user){
    return res.send('Email not found!')
  }
  const validPassword = await usersRepo.comparePassword(
    user.password,
    password
  );
  if( !validPassword ){
    return res.send('Invalid password')
  }
  req.session.userId = user.id;
  res.send('You are signed in !!!')

})
module.exports= router;