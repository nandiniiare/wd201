const express = require('express');
var csrf =require("csurf");
const app = express();
const PORT = process.env.PORT || 3000;
const bodyParser = require('body-parser');
var cookieParser = require("cookie-parser");
const path = require("path");
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false}));
app.use(cookieParser("shh! some secret string"));
app.use(csrf({ cookie: true }))

const { Todo } = require("./models");
const { error } = require('console');
app.set("view engine","ejs");
const createSampleItems = async () => {
  try {
      // Create sample due today item
      await Todo.create({
          title: 'Sample Due Today Item',
          dueDate: new Date(),
          completed: false,
      });

      // Create sample due later item
      await Todo.create({
          title: 'Sample Due Later Item',
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Due after 7 days
          completed: false,
      });

      // Create sample overdue item
      await Todo.create({
          title: 'Sample Overdue Item',
          dueDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Due 7 days ago
          completed: false,
      });

      console.log('Sample items created successfully');
  } catch (error) {
      console.error('Error creating sample items:', error);
  }
};
app.use(async (req, res, next) => {
  // You can add more conditions to run this only once, such as checking if sample items exist
  await createSampleItems();
  next();
});

app.get("/", async (request,response) => {
      const overdue = await Todo.overdue();
      const dueToday = await Todo.dueToday();
      const dueLater = await Todo.dueLater();   
      if(request.accepts("html")) {
         response.render("index", {
            title: "Todo application",
            overdue,
            dueToday,
            dueLater,
            csrfToken: request.csrfToken(), 
         });
      }else{
         response.json({
            overdue,
            dueToday,
            dueLater,
         })
      }
});
app.use(express.static(path.join(__dirname,'public')));
app.get("/todos", async (request, response) => {
   try {
      const todos = await Todo.findAll();
      return response.json(todos);
   } catch (error) {
      console.error(error);
      return response.status(500).json({ error: "Internal Server Error" });
   }
});

// In your server route for creating todos
app.post('/todos', async (req, res) => {
  try {
    const { title, dueDate } = req.body;

    // Client-side validation
    if (!title || !dueDate) {
      return res.status(400).json({ error: 'Title and Due Date are required' });
    }

    const newTodo = await Todo.create({
      title,
      dueDate,
      completed: false,
    });

    res.status(201).json(newTodo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// In your Express server
app.put('/todos/:id', async (req, res) => {
   try {
     const todoId = req.params.id;
     const { completed } = req.body;
 
     const todo = await Todo.findByPk(todoId);
 
     if (!todo) {
       return res.status(404).json({ error: 'Todo not found' });
     }
 
     await todo.setCompletionStatus(completed);
 
     res.status(200).json({ message: 'Todo updated successfully' });
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