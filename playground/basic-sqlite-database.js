// used as example for sqlite...

var Sequelize = require('sequelize');
// new instance of sequelize:
var sequelize = new Sequelize(undefined, undefined, undefined, {
    'dialect':'sqlite',
    'storage': __dirname + '/basic-sqlite-database.sqlite' // a file
});
// for sequelize validation:
// http://docs.sequelizejs.com/en/latest/

var Todo = sequelize.define('todo', {
    description: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            len:[1, 250]
        }
    },
    completed: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
});

sequelize.sync().then(function(){
    console.log('Everything is in synch!');

    Todo.findById(1).then(function(todo){
        if(todo){
            console.log(todo.toJSON());
        } else {
            console.log('Todo not found.');
        }
    })
});
