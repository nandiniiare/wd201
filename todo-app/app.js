const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const path = require("path");
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false}));

const { Todo } = require("./models");
app.set("view engine","ejs");

app.get("/", async (request,response) => {
   try {
      const overdue = await Todo.overdue();
      const dueToday = await Todo.dueToday();
      const dueLater = await Todo.dueLater();   
      response.render("index", {
         title: "Todo application",
         overdue,
         dueToday,
         dueLater,   
      });
   }catch (error) {
      console.error(error);
      response.status(500).send('Internal Server Error');
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
      const todo = await Todo.findByPk(todoId);
      if (!todo) {
         return response.status(404).json({ success: false, message: "Todo not found" });
      }

      const updatedTodo = await todo.markAsCompleted();
      return response.json(updatedTodo);
   } catch (error) {
      console.error(error);
      return response.status(500).json({ success: false, message: "Internal Server Error" });
   }
});

app.delete("/todos/:id", async function (request, response) {
   console.log("We have to delete a Todo with ID: ", request.params.id);
   try {
     const todo = await Todo.findByPk(request.params.id); // Find the Todo by ID
 
     if (!todo) {
       response.send(false); // If Todo not found, respond with false
       return;
     }
 
     await todo.destroy(); // Delete the Todo
     response.send(true); // Respond with true upon successful deletion
   } catch (error) {
     console.error("Error deleting todo:", error);
     response.status(500).json(false); // Respond with false in case of an error
   }
 });
 module.exports = app;