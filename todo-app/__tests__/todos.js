const request = require("supertest");
const db = require("../models/index");
const app = require("../app");

let server,agent;
describe("Todo test suite",() => {
    beforeAll(async () => {
        await db.sequelize.sync({force: true});
        server = app.listen(3000, () => { });
        agent = request.agent(server);
     });
     afterAll( async () => {
        await db.sequelize.close();
        server.close();
     });
     test("responds with json at /todos",async () => {
        const response = await agent.post('/todos').send({
            'title' : 'Buy milk',
            dueDate: new Date().toString(),
            completed: false
        });
        expect(response.statusCode).toBe(200);
        expect(response.header["content-type"]).toBe("application/json; charset=utf-8");
        const parsedResponse =JSON.parse(response.text);
        expect(parsedResponse.id).toBeDefined();
     });
     test("Mark a todo as complete", async () => {
        jest.setTimeout(20000);
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
        jest.setTimeout(5000);
      });
      test("Deletes a todo with the given ID if it exists and sends a boolean response", async () => {
        const response = await agent.post("/todos").send({
           title: "Buy milk",
           dueDate: new Date().toISOString(),
           completed: false,
        });
     
        const parsedResponse = JSON.parse(response.text);
        const todoID = parsedResponse.id;
     
        expect(parsedResponse.completed).toBe(false);
     
        const deleteTodo = await agent.delete(`/todos/${todoID}`);
        const parsedDeleteResponse = JSON.parse(deleteTodo.text);
        expect(parsedDeleteResponse).toHaveProperty("success");
        expect(parsedDeleteResponse).toHaveProperty("message");
        // Ensure the response is a boolean indicating success.
        expect(typeof parsedDeleteResponse.success).toBe("boolean");
        if (parsedDeleteResponse.success) {
         expect(parsedDeleteResponse.message).toBe("Todo deleted successfully");
     } else {
         expect(parsedDeleteResponse.message).toBe("Todo not found");
     }
     });
     
});