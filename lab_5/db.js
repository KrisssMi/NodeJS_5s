var events = require("events");
var util = require("util");

var db_array = [
  { id: 1, pname: "John", bday: "2022-08-01" },
  { id: 2, pname: "Peter", bday: "2022-09-01" },
  { id: 3, pname: "Mary", bday: "2022-10-01" },
  { id: 4, pname: "Ann", bday: "2022-03-01" },
  { id: 5, pname: "Bob", bday: "2022-02-01" },
  { id: 6, pname: "Alice", bday: "2022-04-01" },
];

function DB() {
  // конструктор объекта БД
  this.select = () => {
    return Promise.resolve(db_array);
  };
  this.insert = (r) => {
    const isIdExists = db_array.find((user) => user.id === r.id);

    if (isIdExists) return Promise.reject("Id already exists");

    db_array.push(r);
    return Promise.resolve(r);
  };
  this.update = (r) => {
    const isIdExists = db_array.find((user) => user.id === r.id);
    if (isIdExists) {
      db_array = db_array.map((user) => {
        if (user.id === r.id) {
          return r;
        }
        return user;
      });
      return Promise.resolve(r);
    }

    return Promise.reject("Id not found");
  };
  this.delete = (id) => {
    let delIndex = db_array.findIndex((element) => element.id == id);

    if (delIndex !== -1) {
      r = db_array[delIndex];
      db_array.splice(delIndex, 1);
      return Promise.resolve(r);
    } else {
      return Promise.reject("Id not found");
    }
  };
}

util.inherits(DB, events.EventEmitter);
exports.DB = DB;
