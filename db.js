// needed for sql database

var Sequelize = require('sequelize');
// new instance of sequelize:
var sequelize = new Sequelize(undefined, undefined, undefined, {
    'dialect':'sqlite',
    'storage': __dirname + '/data/dev-todo-api.sqlite' // a file
});

var db = {}; // object with potentially many js keys: values

db.todo = sequelize.import(__dirname + '/models/todo.js');
db.sequelize = sequelize; // add new instance
db.Sequelize = Sequelize; // add module library
// exports can only can be set to one oject
module.exports = db; // now conatins
