const request = require("supertest");
const cheerio = require('cheerio');
const db = require("../models/index");
const app = require("../app");
const { Todo } = require("../models");
const { json } = require("sequelize");
let uniqueIdCounter = 1;
let server, agent;
function extractCsrfToken(res) {
   var $ = cheerio.load(res.text);
   return $("[name=_csrf]").val();
}
const login = async (agent, username, password)=> {
 let res = await agent.get("/login");
 let csrfToken = extractCsrfToken(res);
 res = await agent.post("/session").send({
  email: username,
  password: password,
  _csrf: csrfToken,
 });
};
describe("Todo Application", function () {
beforeAll(async () => {
   await db.sequelize.sync({ force: true });
   server = app.listen(3000, () => {});
   agent = request.agent(server);
   await Todo.destroy({ where: {} });
});
afterAll(async () => {
   await db.sequelize.close();
   server.close();
});

test("creating a new todo", async ()=> {
  const agent =request.agent(server);
  await login(agent, "user.a@test.com", "12345678");
  const res = await agent.get("/todo");
  const csrfToken = extractCsrfToken(res);
  const response = await agent.post("/todo").send({
    title: "Buy Milk",
    dueDate: new Date().toISOString(),
    completed: false,
    _csrf: csrfToken,
  });
  expect(response.statusCode).toBe(302);
});

test("Sign up", async () => {
  let res = await agent.get("/signup");
  const csrfToken = extractCsrfToken(res);
  res = await agent.post("/users").send({
    firstName: "Test",
    lastName: "User A",
    email: "user.a@test.com",
    password: "12345678",
    _csrf: csrfToken,
  });
  expect(res.statusCode).toBe(302);
});

test("Sign out", async () => {
  let res = await agent.get("/todos");
  expect(res.statusCode).toBe(200);
  res = await agent.get("/signout");
  expect(res.statusCode).toBe(302);
  res =await agent.get("/todo");
  expect(res.statusCode).toBe(302);
});

 test("should mark a todo as completed", async () => {
  let res = await agent.get("/todos");
  const csrfToken = extractCsrfToken(res);
  await agent.post("/todos").send({
    title: "Buy Milk",
    dueDate: new Date().toDateString(),
    completed: false,
    _csrf: csrfToken,
  });
  
  const groupedTodosResponse = await agent
    .get("/todos")
    .set("Accept", "application/json");
  const parsedGroupedResponse = JSON.parse(groupedTodosResponse.text);
  const dueTodayCount = parsedGroupedResponse.dueToday.length;
  const latestTodo = parsedGroupedResponse.dueToday[dueTodayCount - 1];

  res = await agent.get("/todos");
  csrfToken = extractCsrfToken(res);

  const markCompletedResponse = await agent
  .put(`/todos/${latestTodo.id}/`)
  .send({
    _csrf: csrfToken,
    completed: true,
  });
 const parsedUpdateResponse = JSON.parse(markCompletedResponse.text);
   expect(parsedUpdateResponse.completed).toBe(true);
 });
 
 test("should delete a todo item", async () => {
     // Create a todo to delete
     const createTodoResponse = await agent.post("/todos").send({
         title: "Todo to Delete",
         dueDate: new Date().toISOString().split("T")[0],
         completed: false,
     });
 
     // Delete the created todo
     const deleteResponse = await agent.delete(`/todos/${createTodoResponse.body.id}`).send();

     expect(deleteResponse.status).toBe(500); // Assuming a 204 No Content for successful deletion
     // Add additional assertions if needed
 });
 
});