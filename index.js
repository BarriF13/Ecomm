const express = require('express');
const bodyParser = require('body-parser');
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
app.post('/',  (req, res) => {
  console.log(req.body);
  res.send('Account created!')

});


app.listen(3000, () => {
  console.log('Listening');
});