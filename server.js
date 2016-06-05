var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var _ = require('underscore'); // underscore.js downloaded npm

var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;
// CRUD = create, read, update, delete
app.use(bodyParser.json());

app.get('/', function(req, res){
    res.send('Todo API Root');
});

app.get('/todos', function(req, res){
    var queryParams = req.query;
    var filteredTodos = todos; // array

    if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'true') {
        filteredTodos = _.where(filteredTodos, {completed:true});
    } else if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'false') {
        filteredTodos = _.where(filteredTodos, {completed:false});
    }

    if (queryParams.hasOwnProperty('q') && queryParams.q.length > 0) {
        filteredTodos = _.filter(filteredTodos, function(todo) {
            return todo.description.toLowerCase().indexOf(queryParams.q.toLowerCase()) > -1;
        });
    }

    res.json(filteredTodos); // express funtion to convert to JSON:
});
//-----------------------------------------------------------------------------
app.get('/todos/:id', function(req, res){
    var todoId = parseInt(req.params.id, 10);
    // Looks through the list and returns the first value that matches all of
    // the key-value pairs:
    var matchedTodo = _.findWhere(todos, {id: todoId}); // finds one instance

    if (matchedTodo) {
        res.json(matchedTodo);
    } else {
        res.status(404).send();
    }
});
//-----------------------------------------------------------------------------
app.post('/todos', function(req, res) {
    var body = _.pick(req.body, 'description', 'completed');

    // validate
    if ((!_.isBoolean(body.completed))||(!_.isString(body.description))||
        (body.description.trim().length === 0)) {
            return res.status(400).send();
    }

    body.description = body.description.trim();
    body.id = todoNextId++;
    todos.push(body);
    res.json(body);
});
//-----------------------------------------------------------------------------
app.delete('/todos/:id', function(req,res){
    var todoId = parseInt(req.params.id, 10);
    var matchedTodo = _.findWhere(todos, {id: todoId});

    if(!matchedTodo) {
        res.status(404).json({"error": "no todo found with that id."});
    } else {
        todos = _.without(todos, matchedTodo);
        res.json(matchedTodo);
    }
});
//-----------------------------------------------------------------------------
app.put('/todos/:id', function(req, res){
    var todoId = parseInt(req.params.id, 10);
    var matchedTodo = _.findWhere(todos, {id: todoId});
    var body = _.pick(req.body, 'description', 'completed');
    var validAttributes = {};

    if (!matchedTodo) {
        return res.status(404).send();
    }

    if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
        validAttributes.completed = body.completed;
    } else if (body.hasOwnProperty('completed')) {
        return res.status(400).send();
    }

    if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length != 0) {
        validAttributes.description = body.description;
    } else if (body.hasOwnProperty('description')) {
        return res.status(400).send();
    }

    matchedTodo = _.extend(matchedTodo, validAttributes);
    res.json(matchedTodo);
});


//----------------------------------------------
app.listen(PORT, function(){
    //debugger;
    console.log('Magic happens on port ' + PORT);
});
