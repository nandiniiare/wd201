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
         return response.status(404).json({ error: "Todo not found" });
      }
      const deleted = await todo.destroy();
      return response.json({ success: !!deleted });
   } catch (error) {
      console.error(error);
      return response.status(500).json({ error: "Internal Server Error" });
   }
});

module.exports = app;
