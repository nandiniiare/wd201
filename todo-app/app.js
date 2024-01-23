const express = require('express');
const app = express();
const csrf = require('tiny-csrf');
const PORT = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser('shh! some secret string'));
app.use(csrf('this_should_be_32_character_long', ['POST', 'PUT', 'DELETE']));

const { Todo } = require('./models');
const { error } = require('console');
app.set('view engine', 'ejs');

app.get('/', async (request, response) => {
  try {
    const allTodos = await Todo.getTodos();
    const overdue = await Todo.overdue();
    const dueToday = await Todo.dueToday();
    const dueLater = await Todo.dueLater();
    const completedItems = await Todo.completedItems();
    if (request.accepts('html')) {
      response.render('index', {
        title: 'Todo application',
        allTodos,
        overdue,
        dueToday,
        dueLater,
        completedItems,
        csrfToken: request.csrfToken(),
      });
    } else {
      response.json({
        overdue,
        dueToday,
        dueLater,
        completedItems,
      });
    }
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/todos', async (_request, response) => {
  console.log('Fetch all todos: ');
  try {
    const allTodos = await Todo.findAll();
    response.send(allTodos);
  } catch (error) {
    console.error(error);
    response.status(422).json(error);
  }
});

app.get('/todos/:id', async (request, response) => {
  try {
    const todo = await Todo.findByPk(request.params.id);
    if (!todo) {
      return response.status(404).json({ error: 'Todo not found' });
    }
    response.json(todo);
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/todos', async (request, response) => {
  console.log('Creating a todo', request.body);
  try {
    await Todo.addTodo({
      title: request.body.title,
      dueDate: request.body.dueDate,
      completed: false,
    });
    response.redirect('/');
  } catch (error) {
    console.error(error);
    response.status(422).json(error);
  }
});

app.put('/todos/:id', async (req, res) => {
  console.log('Updating a todo with ID:', req.params.id);
  try {
    const todoId = req.params.id;
    const { completed } = req.body;

    const todo = await Todo.findByPk(todoId);

    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    await todo.update({ completed });

    const updatedTodo = await Todo.findByPk(todoId);

    res.status(200).json({ message: 'Todo updated successfully', todo: updatedTodo });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/todos/:id', async (req, res) => {
  try {
    const todoId = req.params.id;
    const todo = await Todo.findByPk(todoId);

    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    await todo.destroy();

    res.status(204).end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = app;
