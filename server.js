var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;
var bodyParser = require('body-parser');
var _ = require('underscore');

app.use(bodyParser.json());

//home page
app.get('/', function(req, res) {
    
    res.send('Todo rest API');
});

//getting complete todo list
app.get('/todos', function(req, res) {
    res.json(todos);
});

//GET /todos/:id ...getting individual todo
app.get('/todos/:id', function(req, res) {
    var todoId = parseInt(req.params.id, 10);
    var match = _.findWhere(todos, {id: todoId});
    
    if(match) {
        res.json(match);
    }else {
        res.status(404).send();
    }
});

//POST /todos
app.post('/todos', function(req, res) {
        var body = _.pick(req.body,'description','completed'); 
         
        if(!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length===0 ) {
            return res.status(400).send();
        }
    
        body.description = body.description.trim();
    
        body["id"] = todoNextId++;
        todos.push(body);

        res.json(todos);
});

//listening to the port
app.listen(PORT, function() {
    console.log('Express listening on port: ' + PORT + "!");
});