const express = require('express');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.json());
const { Todo } = require("./models");

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
      const todo = await Todo.addTodo({ title: request.body.title, dueDate: request.body.dueDate, completed: false });
      return response.json(todo);
   } catch (error) {
      console.error(error);
      return response.status(422).json(error);
   }
});

app.put("/todos/:id/markAsCompleted", async (request, response) => {
   console.log("We have to update a todo with ID:", request.params.id);
   const todo = await Todo.findByPk(request.params.id);
   try {
      const updatedTodo = await todo.markAsCompleted();
      return response.json(updatedTodo);
   } catch (error) {
      console.error(error);
      return response.status(422).json(error);
   }
});                         

app.delete("/todos/:id", async (request, response) => {
   const todoId = request.params.id;
   const isTodoIdValid = /^\d+$/.test(todoId);
   if (!isTodoIdValid) {
      return response.status(400).json({ error: "Invalid todo ID" });
   }

   try {
      const todo = await Todo.findByPk(todoId);
      if (!todo) {
         return response.status(404).json({ success: false, message: "Todo not found" });
      }
      
      const deleted = await todo.destroy();
      return response.json({ success: !!deleted, message: "Todo deleted successfully" });
   } catch (error) {
      console.error(error);
      return response.status(500).json({ success: false, message: "Internal Server Error" });
   }
});

module.exports = app;
