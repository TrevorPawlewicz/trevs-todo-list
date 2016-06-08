var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore'); // underscore.js downloaded npm
var db = require('./db.js'); // access to database

var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;
// CRUD = create, read, update, delete
app.use(bodyParser.json());

app.get('/', function(req, res){
    res.send('Todo API Root');
});


app.get('/todos', function(req, res){
    var query = req.query;
    var where = {};

    if (query.hasOwnProperty('completed') && query.completed === 'true') {
        where.completed = true;
    } else if (query.hasOwnProperty('completed') && query.completed === 'false') {
        where.completed = false;
    }

    if (query.hasOwnProperty('q') && query.q.length > 0) {
        where.description = {
            $like: '%' + query.q + '%'
        };
    }

    db.todo.findAll({where: where}).then(function(todos) {
        res.json(todos);
    }, function(e) {
        res.status(500).send();
    });
});
//-----------------------------------------------------------------------------
app.get('/todos/:id', function(req, res){
    var todoId = parseInt(req.params.id, 10);

    db.todo.findById(todoId).then(function(todo){
        if (!!todo) {
            res.json(todo.toJSON());
        } else {
            res.status(404).send();
        }
    }, function (e) {
            res.status(500).send();
    });
});
//-----------------------------------------------------------------------------
app.post('/todos', function(req, res) {
    var body = _.pick(req.body, 'description', 'completed');

    db.todo.create(body).then(function(todo){
        res.json(todo.toJSON());
    }, function(e){
        res.status(400).json(e);
    });
});
//-----------------------------------------------------------------------------
app.delete('/todos/:id', function(req,res){
    var todoId = parseInt(req.params.id, 10);

    db.todo.destroy({
        where: {
            id: todoId
        }
    }).then(function(rowsDeleted) {
        if(rowsDeleted === 0) {
            res.status(404).json({
                error: 'No todo with Id'
            });
        } else {
            res.status(204).send();
        }
    }, function(){
        res.status(500).send();
    });
});
//-----------------------------------------------------------------------------
app.put('/todos/:id', function(req, res){
    var todoId = parseInt(req.params.id, 10);
    var body = _.pick(req.body, 'description', 'completed');
    var attributes = {};

    if (body.hasOwnProperty('completed')) {
        attributes.completed = body.completed;
    }

    if (body.hasOwnProperty('description')) {
        attributes.description = body.description;
    }

    db.todo.findById(todoId).then(function(todo){
        if (todo) {
            todo.update(attributes).then(function(todo){
                // todo update goes well
                res.json(todo.toJSON());
            }, function(e){ // error
                res.status(400).json(e);
            });
        } else {
            res.status(404).send();
        }
    }, function() {
        res.status(500).send();
    });
});

app.post('/users', function (req, res) {
	//                   pick takes object and attributes you want to keep
	var body = _.pick(req.body, 'email', 'password');

	//                                 returns a promise
	db.user.create(body).then(function (user) {
		res.json(user.toJSON());
	}, function (e) { // error
		res.status(400).json(e);
	});
});
//-----------------------------------------------------------------------------
//--------------SYNC------------------------
db.sequelize.sync().then(function(){
    app.listen(PORT, function(){
        //debugger;
        console.log('Magic happens on port ' + PORT);
    });
});
