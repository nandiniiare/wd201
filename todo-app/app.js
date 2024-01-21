const express = require('express');
const app = express();
var csrf =require("tiny-csrf");
const PORT = process.env.PORT || 3000;
const bodyParser = require('body-parser');
var cookieParser = require("cookie-parser");
const path = require("path");

app.use(express.static(path.join(__dirname,'public')));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false}));
app.use(cookieParser("shh! some secret string"));
app.use(csrf("this_should_be_32_character_long", ["POST", "PUT", "DELETE"]));

const { Todo } = require("./models");
const { error } = require('console');
app.set("view engine","ejs");

app.get("/", async (request,response) => {
      const allTodos = await Todo.getTodos();
      const overdue = await Todo.overdue();
      const dueToday = await Todo.dueToday();
      const dueLater = await Todo.dueLater();   
      const completedItems = await Todo.completedItems();
      if(request.accepts("html")) {
         response.render("index", {
            title: "Todo application",
            allTodos,
            overdue,
            dueToday,
            dueLater,
            completedItems,
            csrfToken: request.csrfToken(), 
         });
      }else{
         response.json({
            overdue,
            dueToday,
            dueLater,
            completedItems,
         })
      }
});
app.get("/todos", async (_request, response) => {
  console.log("Fetch all todos: ");
  try {
    const all_todos = await Todo.findAll();
    return response.send(all_todos);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});
app.get("/todos/:id", async (request, response) => {
   try {
      const todos = await Todo.findAll(request.params.id);
      return response.json(todos);
   } catch (error) {
      console.error(error);
      return response.status(500).json({ error: "Internal Server Error" });
   }
});

app.post("/todos", async (request, response) => {
   console.log("Creating a todo", request.body);
   try {
      console.log(request.body);
      await Todo.addTodo({
         title: request.body.title,
         dueDate: request.body.dueDate,
         completed: false
      });
      return response.redirect("/");
   } catch (error) {
      console.error(error);
      return response.status(422).json({ error: "Unprocessable Entity" });
   }
});

app.put('/todos/:id', async (request, response) => {
  try {
    const todoId = parseInt(request.params.id, 10);
    const updatedTodo = await Todo.update(
      { completed: request.body.completed },
      { where: { id: todoId }, returning: true }
    );

    console.log("Updated Todo:", updatedTodo); // Log the updated todo
    response.json(updatedTodo[1][0]); // Send the updated todo in the response
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: 'Internal Server Error' });
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
