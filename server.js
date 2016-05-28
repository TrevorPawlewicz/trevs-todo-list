var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var _ = require('underscore'); // underscore.js downloaded npm

var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());

app.get('/', function(req, res){
    res.send('Todo API Root');
});

app.get('/todos', function(req, res){
    // express funtion to convert to JSON:
    res.json(todos);
});

app.get('/todos/:id', function(req, res){
    var todoId = parseInt(req.params.id, 10);
    // Looks through the list and returns the first value that matches all of
    // the key-value pairs:
    var matchedTodo = _.findWhere(todos, {id: todoId});

    if (matchedTodo) {
        res.json(matchedTodo);
    } else {
        res.status(404).send();
    }
});

app.post('/todos', function(req, res) {
    var body = _.pick(req.body, 'description', 'completed');

    // validate
    if ((!_.isBoolean(body.completed))||(!_.isString(body.description))||(body.description.trim().length === 0)) {
        return res.status(400).send();
    }

    body.description = body.description.trim();
    body.id = todoNextId++;
    todos.push(body);
    res.json(body);
});





//----------------------------------------------
app.listen(PORT, function(){
    console.log('Magic happens on port ' + PORT);
});
