const express = require('express');

// app is an object that describe everything that webserver can do 
const app = express();

//route handler -- tells server what to do when in gets network request from browser 
//req or request have info about user input or request --from user --object
//res or response have info from server and data  -- from server --object 
app.get('/', ( req, res )=> {
  res.send(`
    <div>
    <form>
      <input placeholder = "email"/>
      <input placeholder = "password"/>
      <input placeholder = "password confirmation"/>
      <button>Sign Up</button>
    </form>
    </div>
  `)

});

app.listen(3000, () =>{
  console.log('Listening');
});