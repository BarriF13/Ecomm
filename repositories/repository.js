const fs = require('fs');
const crypto = require('crypto');
module.exports = class Repository {
  constructor(filename) {
    //if no file name 
    if (!filename) {
      throw new Error('Creating a repository requires a filename');
    }

    this.filename = filename;
    try {   //If file name exist
      fs.accessSync(this.filename);
    } catch (err) { //if not make one
      fs.writeFileSync(this.filename, '[]')
    }
  }

  async create(attrs){
    attrs.id = this.randomId();

     const records = await this.getAll();
     records.push(attrs); 
     await this.writeAll(records);

     return attrs;
  }

  async getAll() {
    return JSON.parse(
      await fs.promises.readFile(this.filename, {
        encoding: 'utf-8'
      })
    );
  }


  async writeAll(records) {
    await fs.promises.writeFile(
      this.filename,
      JSON.stringify(records, null, 2));// 2 in indentation

  }
  randomId() {
    return crypto.randomBytes(4).toString('hex');

  }
  async getOne(id) {
    const records = await this.getAll()
    return records.find(record => record.id === id);
  }
  async delete(id) {
    const records = await this.getAll();
    const filteredRecord = records.filter(record => record.id !== id);
    await this.writeAll(filteredRecord);
  }
  async update(id, attrs) {
    const records = await this.getAll();// get all the records
    const record = records.find(record => record.id === id);//find the specific record

    if (!record) {
      throw new Error(`Record with id ${id} not found`);
    }
 
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


};