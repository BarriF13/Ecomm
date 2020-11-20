const fs = require('fs')

class UserRepository {
  constructor(filename) {
    //if no file name 
    if (!filename) {
      throw new Error('Creating a repository requires a filename ')
    }

    this.filename = filename;
    try {
      //If file name 
      fs.accessSync(this.filename);
    } catch (err){
      fs.writeFileSync(this.filename, '[]')
    }
   
  }

}


/// tests

//new UserRepository();
const repo = new UserRepository('users.json');