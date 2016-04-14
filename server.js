var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;
var todos = [{
    id: 1,
    description: "Visit shiv mandir",
    completed: false
}, {
    id: 2,
    description: "Purchase stuff",
    completed: false
}, {
    id: 3,
    description: "Learn node.js",
    completed: true
}];

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
    var match = true;
    
    todos.forEach(function(todo) {
        if(todo["id"] === todoId) {
            res.json(todo);
            match = false;
        }
    });
    
    if(match) {
        res.status(404).send();
    }
});

//listening to the port
app.listen(PORT, function() {
    console.log('Express listening on port: ' + PORT + "!");
});