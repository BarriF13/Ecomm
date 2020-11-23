const fs = require('fs')
const crypto = require('crypto');
const util = require('util');

//promise version
const scrypt = util.promisify(crypto.scrypt);
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

  async getAll() {

    return JSON.parse(
      await fs.promises.readFile(this.filename, { encoding: 'utf-8' }));
  }
  //attributes or attrs is object that has  { email= 'bla@blabla.com', password=123, passwordConfirmation= 123}
  async create(attrs) {
    // attrs ==={ email: '', password:'' }
    attrs.id = this.randomId();

    const salt = crypto.randomBytes(8).toString('hex');
    //call back version of scrypt -- wont use this one instead we will use promised version of the scrypt
    //  scrypt(attrs.password, salt, 64, (err , buf)=>{
    //   const hashed = buf.toString('hex');
    //Promise version 
    const buf = await scrypt(attrs.password, salt, 64);
    //attrs.bd = 'I love javascript';
    // --1 get all the data as array 
    const records = await this.getAll();
    //--2 push the details to array
    //records.push(attrs,);

    const record = {
      ...attrs,
      password: `${buf.toString('hex')}.${salt}`
    }
    records.push(record);


    await this.writeAll(records);
    // return attrs;
    return record;
  }
  async comparePassword(saved, supplied) {
    //Saved -> pass saved in our database.'hashed.salt'
    // Supplied -> pass given to us by a user trying to sign in

    // const result = saved.split('.');
    // const hashed = result[0];
    // const salt = result[1];
    //above is equal to below 
    const [hashed, salt] = saved.split('.');
    const hashedSuppliedBuf = await scrypt(supplied, salt, 64);

    return hashed === hashedSuppliedBuf.toString('hex');
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
    Object.assign(record, attrs)//object.assign takes every thing fro, 
    await this.writeAll(records);
  }

  async getOneBy(filters) {
    const records = await this.getAll();
    //loop in array
    for (let record of records) {
      let found = true;
      //loop in object
      for (let key in filters) {
        if (record[key] !== filters[key]) {
          found = false;
        }
      }
      if (found) { // if found is true mean we found the record so we return it
        return record;
      }
    }
  }

  randomId() {
    //return Math.random() * 99999;
    return crypto.randomBytes(4).toString('hex');

  }
}

//Export the module 
// module.export = UsersRepository; 

//instead of exporting the class we export the instance of the class with the json file already set for preventing mistakes later in coding
module.exports = new UserRepository('users.json');