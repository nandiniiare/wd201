const { request } = require('express');
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
    try {
      const todo = await Todo.findByPk(todoId);
  
      if (!todo) {
        // If the todo doesn't exist, send a boolean response indicating failure.
        return response.json({ success: false });
      }
  
      // If the todo exists, delete it.
      await todo.destroy();
  
      // Fetch all todos after deletion and send the updated list.
      const updatedTodos = await Todo.findAll();
      return response.json(updatedTodos);
    } catch (error) {
      console.error(error);
      return response.status(500).json({ error: "Internal Server Error" });
    }
  });
  
  
module.exports = app;
