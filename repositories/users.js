const fs = require('fs')

class UserRepository {
  constructor(filename) {
    //if no file name 
    if (!filename) {
      throw new Error('Creating a repository requires a filename ')
    }

    this.filename = filename;
    try {
      //If file name exist
      fs.accessSync(this.filename);
    } catch (err) {
      //if not make one
      fs.writeFileSync(this.filename, '[]')
    }

  }
  // async getAll(){
  //   // Open the file called this.filename
  //   const contents = await fs.promises.readFile(this.filename, {encoding:'utf-8'});
  //   // Read its content
  //  // console.log(contents);
  //   // Parse the contents
  // const data = JSON.parse(contents);
  //   // Return the parsed data
  //  return data;
  // }
  //--- refactor the getAll
  async getAll() {

    return JSON.parse(
      await fs.promises.readFile(this.filename, { encoding: 'utf-8' }));
  }
}
/// tests
//----------------1
//new UserRepository();
//----------------2
// const test = async () => {
// const repo = new UserRepository('users.json');

// await repo.getAll();
// };
//-----------------3
const test = async () => {
  const repo = new UserRepository('users.json');

  const users = await repo.getAll();
  console.log(users);
};
test();