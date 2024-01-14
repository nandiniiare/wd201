const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const path = require("path");
app.use(bodyParser.json());

const { Todo } = require("./models");
app.set("view engine","ejs");

app.get("/", async (request, response) => {
   try {
       const allTodos = await Todo.findAll();

       // Filter overdue todos
       const overdue = allTodos.filter(todo => todo.dueDate < new Date() && !todo.completed);

       // Filter due today todos
       const today = new Date();
       today.setHours(0, 0, 0, 0);
       const duetoday = allTodos.filter(todo => todo.dueDate >= today && todo.dueDate < new Date(today.getTime() + 24 * 60 * 60 * 1000));

       // Filter due later todos
       const later = allTodos.filter(todo => todo.dueDate > new Date(today.getTime() + 24 * 60 * 60 * 1000));

       if (request.accepts('html')) {
           // Render HTML view
           response.render('index', {
               title: 'Your Title',
               data: allTodos,
               overdue,
               duetoday,
               duelater: later, // Include the due later todos
           });
       } else {
           // Send JSON response
           response.json({
               allTodos,
               overdue,
               duetoday,
               duelater: later,
           });
       }
   } catch (error) {
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
   try {
      const todo = await Todo.addTodo({
         title: request.body.title,
         dueDate: request.body.dueDate,
         completed: false
      });
      return response.json(todo);
   } catch (error) {
      console.error(error);
      return response.status(422).json({ error: "Unprocessable Entity" });
   }
});

app.put("/todos/:id/markAsCompleted", async (request, response) => {
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
