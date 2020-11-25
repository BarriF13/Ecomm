const layout = require('../layout');

const getError = (errors,  property ) => {
  //property === 'email' || 'password' || 'passwordConfirmation'
  try {
    return errors.mapped()[property].msg;
  } catch(err){
    return '';
   }
  };
    /* /the only we care or want to refer to : is msg in the objects below
     errors .mapped() === is the whole error object then
   //[property] is looking at the sub object and then msg is inside the sub object 
    email: {
      value:
      msg:'invalid email'
      param: ...
    },
    password:{
      msg:
    }, passwordConfirmation:{
  
      msg:
    }
  }*/
  
  module.exports = ({ req, errors }) => {
    return layout({
      content: `  
  <div>
  Your ID : ${req.session.userId}
    <form method="POST">
      <input name="email" placeholder = "email"/>
      ${getError(errors, 'email')}
      <input name="password" placeholder = "password"/>
      ${getError(errors, 'password')}

      <input name="passwordConfirmation" placeholder = "password confirmation"/>
      ${getError(errors, 'passwordConfirmation')}

      <button>Sign Up</button>
    </form>
  </div>
   `
    });
  }