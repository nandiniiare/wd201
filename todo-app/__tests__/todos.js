const request = require("supertest");
const cheerio = require('cheerio');
const db = require("../models/index");
const app = require("../app");
const { Todo } = require("../models");
const { json } = require("sequelize");
let server, agent;
function extractCsrfToken(res) {
   var $ = cheerio.load(res.text);
   return $("[name=_csrf]").val();
}
describe("Todo Application", function () {
beforeAll(async () => {
   await db.sequelize.sync({ force: true });
   server = app.listen(3000, () => {});
   agent = request.agent(server);
});
afterEach(async () => {
   // Clean up after each test
   await Todo.destroy({ where: {} });
});
afterAll(async () => {
   await db.sequelize.close();
   server.close();
});
test("should not create a todo item with empty date", async () => {
   const res = await agent.post("/todos").send({
      title: "Empty date todo",
      dueDate: "",
      completed: false,
    });
    expect(res.status).toBe(400);
 });
 
test("should create a sample due today item", async () => {
   const response = await agent.post("/todos").send({
       title: "Sample duetoday",
       dueDate: new Date().toISOString().split("T")[0],
       completed: false,
   });

   // Adjust the expectations based on your application's behavior
   expect(response.status).toBe(201); // Assuming a 201 Created for successful creation
   // Add additional assertions if needed
});
test("should create a sample due later item", async () => {
   const tomorrow = new Date();
   tomorrow.setDate(tomorrow.getDate() + 1);

   const response = await agent.post("/todos").send({
       title: "Sample duelater",
       dueDate: tomorrow.toISOString().split("T")[0],
       completed: false,
   });

   // Adjust the expectations based on your application's behavior
   expect(response.status).toBe(201); // Assuming a 201 Created for successful creation
   // Add additional assertions if needed
});
test("should Create a sample overdue item", async () => {
   const yesterday = new Date();
   yesterday.setDate(yesterday.getDate() - 1);
   const res = await agent.post("/todos").send({
     title: "Submit assignment",
     dueDate: yesterday.toISOString().split("T")[0],
     completed: false,
   });
   expect(res.status).toBe(201);
 });

/*
test("should mark an overdue item as completed", async () => {
   // Create an overdue todo
   const overdueTodo = await agent.post("/todos").send({
     title: "Overdue Todo",
     dueDate: new Date().toISOString().split("T")[0],
     completed: false,
   });
   const overdueTodoId = Number(overdueTodo.header.location.split("/")[2]);
   // Mark the overdue todo as completed
   const markCompletedResponse = await agent
     .put(`/todos/${overdueTodoId}`)
     .send({
       _csrf: extractCsrfToken(overdueTodo),
       completed: true,
     });
 
   // Log the response body
   console.log(markCompletedResponse.body);
   expect(markCompletedResponse.status).toBe(200);
   expect(markCompletedResponse.body.completed).toBe(true);
 });
 
 test("should toggle a completed item to incomplete when clicked on it", async () => {
   const completedTodo = await agent.post("/todos").send({
     title: "Complete Todo",
     dueDate: new Date().toISOString().split("T")[0],
     completed: true,
   });
   const completedTodoId = Number(completedTodo.header.location.split("/")[2]);

   const toggleResponse = await agent.put(`/todos/${completedTodoId}`).send({
     _csrf: extractCsrfToken(completedTodo),
     completed: false,
   });
 
   // Log the response body
   console.log(toggleResponse.body);
   expect(toggleResponse.status).toBe(200);
   expect(toggleResponse.body.completed).toBe(false);
 });
 */

 test("should delete a todo item", async () => {
   // Create a todo to delete
   const createTodoResponse = await agent
       .post("/todos")
       .send({
           title: "Todo to Delete",
           dueDate: new Date().toISOString().split("T")[0],
           completed: false,
       });

   // Delete the created todo
   const deleteResponse = await agent
       .delete(`/todos/${createTodoResponse.body.id}`)
       .send();

   // Adjust the expectations based on your application's behavior
   expect(deleteResponse.status).toBe(204); // Assuming a 204 No Content for successful deletion
   // Add additional assertions if needed
});
});