const express = require('express');

// app is an object that describe everything that webserver can do 
const app = express();

//route handler -- tells server what to do when in gets network request from browser 
//req or request have info about user input or request --from user --object
//res or response have info from server and data  -- from server --object 
app.get('/', ( req, res )=> {
  res.send(`
    <div>
    <form method="POST">
      <input name="email" placeholder = "email"/>
      <input name="password" placeholder = "password"/>
      <input name="password confirmation" placeholder = "password confirmation"/>
      <button>Sign Up</button>
    </form>
    </div>
  `)

});
app.post('/', (req, res)=>{
res.send('Account created!')

}); 
app.listen(3000, () =>{
  console.log('Listening');
});