const express = require('express');
// middleware functions---
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const authRouter = require('./routes/admin/auth')


// app is an object that describe everything that webserver can do 
const app = express();

//css
app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({
  keys: ['bla1mnaena32']
}));

app.use(authRouter);

app.listen(3000, () => {
  console.log('Listening');
});
