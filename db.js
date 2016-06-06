// needed for sql database

var Sequelize = require('sequelize');
// process is an object that has key:value pairs
var env = process.env.NODE_ENV || 'development';
var sequelize;

if (env === 'production') { // only true if running on Heroku
    sequelize = new Sequelize(process.env.DATABASE_URL, {
        dialect: 'postgres'
    });
} else {
    sequelize = new Sequelize(undefined, undefined, undefined, {
        'dialect':'sqlite',
        'storage': __dirname + '/data/dev-todo-api.sqlite' // a file
    });
}

var db = {}; // object with potentially many js keys: values

db.todo = sequelize.import(__dirname + '/models/todo.js');
db.sequelize = sequelize; // add new instance
db.Sequelize = Sequelize; // add module library
// exports can only can be set to one oject
module.exports = db; // now conatins
