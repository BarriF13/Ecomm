const fs = require('fs')
const crypto = require('crypto');

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
  //attributes or attrs is object that has  { email= 'bla@blabla.com', password=123, passwordConfirmation= 123}
  async create(attrs) {
    attrs.id = this.randomId();
    attrs.bd = 'I love javascript';
    // --1 get all the data as array 
    const records = await this.getAll();
    //--2 push the details to array
    records.push(attrs,);
    //write the updated 'records' array back to this.users.JSON
    //await fs.promises.writeFile(this.filename, JSON.stringify(records));

    await this.writeAll(records);
  }

  async writeAll(records) {
    await fs.promises.writeFile(
      this.filename,
      JSON.stringify(records, null, 2));// 2 in indentation

  }
  async getOne(id) {
    const records = await this.getAll()
    return records.find(record => record.id === id);
  }
  async delete(id) {
    const records = await this.getAll();
    //filter will eliminate the ids which does not want to be deleted --true
    const filteredRecord = records.filter(record => record.id !== id);
    //and we put those records back
    await this.writeAll(filteredRecord)
  }
  async update(id, attrs) {
    const records = await this.getAll();// get all the records
    const record = records.find(record => record.id === id);//find the specific record

    if (!record) {
      throw new Error(`Record with id ${id} not found`);
    }
    // records ==={ email: 'test@test.com'}
    // attrs ==={ password: '1234'}
    Object.assign(record, attrs)//object.assign takes every thing fro, attrs and put it in record
    // record = {email: 'test@test.com', password: '1234' }


    //after update we put the record to the array
    await this.writeAll(records);
  }

  async getOneBy(filters) {
    const records = await this.getAll();
    //loop in array
    for (let record of records) {
      let found = true;
      //loop in object
      for (let key in filters) {
        if(record[key] !== filters[key] ){
          found = false;
        }
      }
      if(found){ // if found is true mean we found the record so we return it
        return record;
      }
    }
  }

  randomId() {
    //return Math.random() * 99999;
    return crypto.randomBytes(4).toString('hex');

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
  //--1 create a repo with a given name
  const repo = new UserRepository('users.json');
  //--4 create a user
  // await repo.create({ email: 'bla@blabla.com' });

  //-7 update
  //await repo.update( "3c134864",{password: 'my pass'})

  // -8 get one by
  const user = await repo.getOneBy({
    "id": "3c134864"
     
     })

  //--6 test id
  //const user = await repo.getOne("1e81118b");
  //-- test delete 
  //await repo.delete("1e81418b");
  // --5 get all the users
  //const users = await repo.getAll();


  //log them out
  console.log(user);

};

test();