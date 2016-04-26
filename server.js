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
    var queryParams = req.query;
    var filteredTodos = todos;
    
    if(queryParams.hasOwnProperty("completed") && queryParams.completed === "true") {
        filteredTodos = _.where(filteredTodos, {completed: true});
    } else if(queryParams.hasOwnProperty("completed") && queryParams.completed === "false") {
        filteredTodos = _.where(filteredTodos, {completed: false});
    }
    
    res.json(filteredTodos);
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

//DELETE /todos/:id ...deleting individual todo
app.delete('/todos/:id', function(req, res) {
    var todoId = parseInt(req.params.id, 10);
    var match = _.findWhere(todos, {id: todoId});
    
    if(match) {
       todos = _.without(todos, match);
        res.json(match);
    }else {
        res.status(404).send();
    }
});

//PUT /todos/:id ...updating individual todo
app.put('/todos/:id', function(req, res) {
    var todoId = parseInt(req.params.id, 10);
    var match = _.findWhere(todos, {id: todoId});
    
    if(!match) {
        return res.status(404).send();
    }
    
    var body = _.pick(req.body, 'description', 'completed');
    var validAttributes = {};
    
    if(body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
        validAttributes.completed = body.completed;
    } else if (body.hasOwnProperty('completed')) {
        return res.status(400).send();
    }
    
    if(body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0) {
        validAttributes.description = body.description;
    } else if (body.hasOwnProperty('description')) {
        return res.status(400).send();
    }
    
    _.extend(match, validAttributes);
    res.json(match);
});

//listening to the port
app.listen(PORT, function() {
    console.log('Express listening on port: ' + PORT + "!");
});