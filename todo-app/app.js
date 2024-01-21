const express = require('express');
const app = express();
const csrf = require('tiny-csrf');
const PORT = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const { Todo } = require('./models');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser('shh! some secret string'));
app.use(csrf('this_should_be_32_character_long', ['POST', 'PUT', 'DELETE']));

app.set('view engine', 'ejs');

app.get('/', async (request, response) => {
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
});
app.get("/todos", async (_request, response) => {
  console.log("Fetch all todos: ");
  try {
    const all_todos = await Todo.findAll();
    return response.json(all_todos);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});
app.get("/todos/:id", async (request, response) => {
   try {
      const todos = await Todo.findByPk(request.params.id);
      if (!todos) {
        return response.status(404).json({ error: "Todo not found" });
     }
      return response.json(todos);
   } catch (error) {
      console.error(error);
      return response.status(500).json({ error: "Internal Server Error" });
   }
});

app.post('/todos', async (request, response) => {
  try {
    const { title, dueDate } = request.body;

    if (!title || !dueDate) {
      return response.status(400).json({ error: 'Title and dueDate are required' });
    }

    await Todo.addTodo({
      title,
      dueDate,
      completed: false,
    });

    return response.redirect('/');
  } catch (error) {
    console.error(error);
    return response.status(422).json({ error: 'Unprocessable Entity' });
  }
});

app.put('/todos/:id', async (req, res) => {
  console.log("Updating a todo with ID:", req.params.id);
  const todoId = req.params.id;
  const todo = await Todo.findByPk(todoId);
  try {
    const updatedTodo = await todo.setCompletionStatus(req.body.completed);
    return res.json(updatedTodo);
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

    res.status(204).end(); // No content
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

 module.exports = app;
