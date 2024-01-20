const express = require('express');
const csrf = require("csurf");
const app = express();
const PORT = process.env.PORT || 3000;
const bodyParser = require('body-parser');
var cookieParser = require("cookie-parser");
const path = require("path");
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false}));
app.use(cookieParser("shh! some secret string"));
app.use(csrf({ cookie: true }));

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

app.put("/todos/:id/markAsCompleted", async (request, response) => {
   console.log("Received markAsCompleted request");
   const todoId = request.params.id;
   try {
      const updatedTodo = await Todo.findByPk(todoId);
      if (updatedTodo) {
         updatedTodo.completed = true;
         await updatedTodo.save();
         console.log("Marked as completed successfully");
         return response.json(updatedTodo);
      } else {
         console.log("Todo not found");
         return response.status(404).json({ error: "Todo not found" });
      }
   } catch (error) {
      console.error("Error processing markAsCompleted:", error);
      return response.status(500).json({ error: "Internal Server Error" });
   }
});

app.delete("/todos/:id", async function (request, response) {
   console.log("Received delete request");
   try {
      await Todo.remove(request.params.id);
      console.log("Deleted successfully");
      return response.json({ success: true });
   } catch (error) {
      console.error("Error processing delete:", error);
      return response.status(422).json(error);
   }
});
 module.exports = app;