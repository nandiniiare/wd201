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
module.exports = {
  "**/*.js": ["eslint --fix", "prettier --write"],
};
app.set("view engine","ejs");

app.get("/", async (request,response) => {
      const allTodos = await Todo.getTodos();
      const overdue = await Todo.overdue();
      const dueToday = await Todo.dueToday();
      const dueLater = await Todo.dueLater();   
      const completedItems = await Todo.completedItems();
      if(request.accepts("html")) {
         response.render("index", {
            allTodos,
            overdue,
            dueToday,
            dueLater,
            completedItems,
            csrfToken: request.csrfToken(), 
         });
      }else{
         response.json({
            allTodos,
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
app.post("/todos", async (request, response) => {
   console.log("Creating a todo", request.body);
   try {
      await Todo.addTodo({
         title: request.body.title,
         dueDate: request.body.dueDate,
      });
      return response.redirect("/");
   } catch (error) {
      console.error(error);
      return response.status(422).json(error);
   }
});

app.put('/todos/:id', async (request, response) => {
  try {
    await csrf.verify(request);
    const todo = await Todo.findByPk(request.params.id);
    const updatedTodo = await todo.setCompletionStatus(request.body.completed);
    return response.json(updatedTodo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});
app.delete("/todos/:id", async (request, response) => {
  console.log("Delete a todo by ID: ", request.params.id);
  try {
    await csrf.verify(request);
    const st = await Todo.remove(request.params.id);
    return response.json(st > 0);
  } catch (error) {
    return response.status(422).json(error);
  }
});
 
 module.exports = app;