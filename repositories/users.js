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
  async create(attrs) {
    //attributes or attrs is object that has  { email= 'bla@blabla.com', password=123, passwordConfirmation= 123}
    // --1 get all the data as array 
    const records = await this.getAll();
    //--2 push the details to array
    records.push(attrs);
    //write the updated 'records' array back to this.users.JSON
    //await fs.promises.writeFile(this.filename, JSON.stringify(records));

    await this.writeAll(records);
  }

  async writeAll(records){
    await fs.promises.writeFile(this.filename, JSON.stringify(records, null, 2));// 2 in indentation
  
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
  //create a repo with a given name
  const repo = new UserRepository('users.json');
  //create a user
  await repo.create({email: 'bla@blabla.com', password: 'test', passwordConfirmation: 'testagain'});
  // get all the users
  const users = await repo.getAll();
//log them out
  console.log(users);

};

test();