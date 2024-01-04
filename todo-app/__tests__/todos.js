const request = require("supertest");
const db = require("../models/index");
const app = require("../app");

let server, agent;

beforeAll(async () => {
   await db.sequelize.sync({ force: true });
   server = app.listen(3000, () => {});
   agent = request.agent(server);
});

afterAll(async () => {
   await db.sequelize.close();
   server.close();
});

test("responds with json at /todos", async () => {
   const response = await agent.post('/todos').send({
      title: 'Buy milk',
      dueDate: new Date().toISOString(),
      completed: false
   });

   expect(response.statusCode).toBe(200);
   expect(response.header["content-type"]).toBe("application/json; charset=utf-8");

   const parsedResponse = JSON.parse(response.text);
   expect(parsedResponse.id).toBeDefined();
});

test("Mark a todo as complete", async () => {
   const response = await agent.post("/todos").send({
      title: "Buy milk",
      dueDate: new Date().toISOString(),
      completed: false,
   });

   const parsedResponse = JSON.parse(response.text);
   const todoID = parsedResponse.id;

   expect(parsedResponse.completed).toBe(false);

   const markAsCompleted = await agent.put(`/todos/${todoID}/markAsCompleted`).send();
   const parsedUpdateResponse = JSON.parse(markAsCompleted.text);
   expect(parsedUpdateResponse.completed).toBe(true);
});
test("Fetches all todos in the database using /todos endpoint", async () => {
   // Assuming you have todos in the database, you can add some todos using your app or Sequelize directly.

   const response = await agent.get('/todos');

   expect(response.statusCode).toBe(200);
   expect(response.header["content-type"]).toBe("application/json; charset=utf-8");

   const parsedResponse = JSON.parse(response.text);
   expect(Array.isArray(parsedResponse)).toBe(true);
   // You can add more specific assertions based on your actual data model.
});
test("Deletes a todo with the given ID if it exists and sends a boolean response", async () => {
   const response = await agent.post("/todos").send({
      title: "Buy milk",
      dueDate: new Date().toISOString(),
      completed: false,
   });

   const parsedResponse = JSON.parse(response.text);
   const todoID = parsedResponse.id;
   expect(parsedResponse.id).toBeDefined();
   
   const Getresponse = await agent.get("/todos");
   const parasedGetresponse = JSON.parse(Getresponse.text);
   const initialTodoCount = parasedGetresponse.length; // Get the initial count

   expect(parsedResponse.completed).toBe(false);

   const deleteTodo = await agent.delete(`/todos/${todoID}`).send();
   expect(deleteTodo.statusCode).toBe(200);
   expect(deleteTodo.header["content-type"]).toBe("application/json; charset=utf-8");
   
   // Adjust the expectation based on the actual state of the database
   const finalGetResponse = await agent.get("/todos");
   const finalParsedGetResponse = JSON.parse(finalGetResponse.text);
   expect(finalParsedGetResponse.length).toBe(initialTodoCount - 1); // Expect one less todo after deletion
   expect(finalParsedGetResponse.some(todo => todo.id === todoID)).toBe(false); // Expect the deleted todo not to be present
});

