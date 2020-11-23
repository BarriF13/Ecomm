const express = require('express');
const bodyParser = require('body-parser');
const usersRepo = require('./repositories/users')
// app is an object that describe everything that webserver can do 
const app = express();
//below makes all the wrap handler use body parse for us 
app.use(bodyParser.urlencoded( { extended: true } ));


//route handler -- tells server what to do when in gets network request from browser 
//req or request have info about user input or request --from user --object
//res or response have info from server and data  -- from server --object 
app.get('/', (req, res) => {
  res.send(`
    <div>
    <form method="POST">
      <input name="email" placeholder = "email"/>
      <input name="password" placeholder = "password"/>
      <input name="passwordConfirmation" placeholder = "password confirmation"/>
      <button>Sign Up</button>
    </form>
    </div>
  `)

});

app.post('/', async (req, res) => {
 const { email, password, passwordConfirmation } = req.body;

 const existingUser = await usersRepo.getOneBy({email: email});
 if(existingUser){
   return res.send('Email has been already registered')
 } 

 if(password !== passwordConfirmation){
  return res.send('Passwords do not match')
}
//Create a user in our user repo to represent this person
const user = await usersRepo.create({email: email, password: password});
//Store the id of that user inside the users cookie


  res.send('Account created!')

});


app.listen(3000, () => {
  console.log('Listening');
});
















//------------ middleware function

// const bodyParser = (req, res, next) => {
//   if (req.method === 'POST') {
//     req.on('data', data => {
//       const parsed = data.toString('utf8').split('&');
//       const formData = {};

//       for (pair of parsed) {
//         const [key, value] = pair.split('=');
//         formData[key] = value;
//       }
//       req.body = formData;
//       next();
//     })
//   } else {
//     next();
//   }
// };
//---- now we use the middleware 