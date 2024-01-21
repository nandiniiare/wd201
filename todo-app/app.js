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
