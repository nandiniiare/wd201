const request = require("supertest");
const cheerio = require('cheerio');
const { DESCRIBE } = require("sequelize");
const express = require("express");
const db = require("../models/index");
const app = require("../app");
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
let server, agent;
function extractCsrfToken(res) {
  const $ = cheerio.load(res.text);
  const csrfToken = $("[name=_csrf]").val();
  return { csrfToken, $ };
}

describe("Todo Application", function () {
beforeAll(async () => {
   await db.sequelize.sync({ force: true });
   server = app.listen(3000, () => {});
   agent = request.agent(server);
});

afterAll(async () => {
  try{
   await db.sequelize.close();
   server.close();
} catch (error) {
  console.log(error);
}
});
test("Creates a todo and responds with JSON at /todos POST endpoint", async () => {
  // Make a request to add a new todo
  const response = await agent.post("/todos").send({
    title: "Buy milk",
    dueDate: new Date().toISOString(),
    completed: false,
  });

  // Assert that the response status code is 201 for successful creation
  expect(response.statusCode).toBe(201);

  // Assert that the response is JSON and contains the expected properties
  const newTodo = response.body;
  expect(newTodo.title).toBe("Buy milk");
  expect(newTodo.dueDate).toBeDefined();
  expect(newTodo.completed).toBe(false);
});
test("Marks a todo with the given ID as complete", async () => {
  // Create a new todo
  const createResponse = await agent.post("/todos").send({
    title: "Buy Milk",
    dueDate: new Date().toISOString(),
    completed: false,
  });

  // Get the ID of the created todo
  const latestTodoId = createResponse.body.id;

  // Mark the todo as complete
  const markCompleteResponse = await agent
    .put(`/todos/${latestTodoId}`)
    .send({
      completed: true,
    });

  // Assert that the response is JSON and contains the expected properties
  const parsedUpdateResponse = JSON.parse(markCompleteResponse.text);
  expect(parsedUpdateResponse.completed).toBe(true);
});
test("Marks a todo with given ID as incomplete", async () => {
  // Create a new todo with completed: true
  const createResponse = await agent.post("/todos").send({
    title: "Buy milk",
    dueDate: new Date().toISOString(),
    completed: true,
  });

  // Get the ID of the created todo
  const latestTodoId = createResponse.body.id;

  // Mark the todo as incomplete
  const markIncompleteResponse = await agent
    .put(`/todos/${latestTodoId}`)
    .send({
      completed: false,
    });

  // Assert that the response is JSON and contains the expected properties
  const parsedUpdateResponse = JSON.parse(markIncompleteResponse.text);
  expect(parsedUpdateResponse.completed).toBe(false);
});
test("Deletes a todo with the given ID if it exists and sends a boolean response", async () => {
  // Create a new todo
  const createResponse = await agent.post("/todos").send({
    title: "Buy fruits",
    dueDate: new Date().toISOString(),
    completed: false,
  });

  // Get the ID of the created todo
  const latestTodoId = createResponse.body.id;

  // Delete the todo
  const deleteResponse = await agent.delete(`/todos/${latestTodoId}`);

  // Assert that the response is true (or whatever your server returns on successful deletion)
  expect(deleteResponse.body).toBe(true);
});
});