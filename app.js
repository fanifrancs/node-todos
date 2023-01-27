const express      = require('express'),
bodyParser         = require('body-parser'),
mongoose           = require('mongoose'),
expressSanitizer   = require('express-sanitizer'),
app                = express();

// configs
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.set('view engine', 'ejs');

const todoSchema = new mongoose.Schema({
    todo: String
});

const Todo = mongoose.model('Todo', todoSchema);

const errorMessage = '<p>Something went wrong <a href="/">Go home</a></p>';

// root
app.get('/', (req, res) => {
    res.redirect('/todos');
})

// get and render todos
app.get('/todos', (req, res) => {
    Todo.find({}, (err, todos) => {
        if (err) {
            res.send(errorMessage);
        } else {
            res.render('index', {todos});
        }
    })
})

// create todo
app.post('/todos', (req, res) => {
    req.sanitize(req.body.todo);
    const { todo } = req.body;
    Todo.create({todo}, (err, newTodo) => {
        if (err) {
            res.send(errorMessage);
        } else {
            res.redirect('/todos');
        }
    })
})

// renders edit form
app.get('/edit/:id', (req, res) => {
    Todo.findById(req.params.id, (err, foundTodo) => {
        if (err) {
            res.send(errorMessage);
        } else {
            res.render('edit', {foundTodo});
        }
    })
})

// handles todo edit
app.post('/edit/:id', (req, res) => {
    req.sanitize(req.body.todo);
    const { todo } = req.body;
    Todo.findByIdAndUpdate(req.params.id, {todo}, (err, updatedTodo) => {
        if (err) {
            res.send(errorMessage);
        } else {
            res.redirect('/todos');
        }
    })
})

// deletes todo
app.post('/delete/:id', (req, res) => {
    Todo.findByIdAndRemove(req.params.id, (err, deletedTodo) => {
        if (err) {
            res.send(errorMessage);
        } else {
            res.redirect('/todos');
        }
    })
})

// launch
app.listen(process.env.PORT || 3500, process.env.IP, () => {
    mongoose.connect('mongodb://127.0.0.1/todos_db');
    console.log('server started');
})
