const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const path = require("path");
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false}));

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

app.put("/todos/:id/markAsCompleted", async (request, response) => {
   console.log("We have to update the todo with ID:", request.params.id);
   const todoId = request.params.id;
   try {
      const updatedTodo = await Todo.findByPk(todoId);
      if (updatedTodo) {
         todo.completed = true; // Set to true for completed, adjust as needed
         await updatedTodo.save();
         return response.json(updatedTodo);
      }else {
         return response.status(404).json(error);
       }
   } catch (error) {
      console.log(error);
      return response.status(500).json(error);
   }
});

app.delete("/todos/:id", async function (request, response) {
   console.log("We have to delete a Todo with ID: ", request.params.id);
   try {
     await Todo.remove(request.params.id);
     return response.json({success: true});
   } catch (error) {
     return response.status(422).json(error);
   }
 });
 module.exports = app;