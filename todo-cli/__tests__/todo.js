// __tests__/todo.js
const SequelizeMock = require("sequelize-mock");


const dbMock = new SequelizeMock();
// Lazy function to create and return the TodoMock
const createTodoMock = () => {
  return dbMock.define("Todo", {
    title: "Test Todo",
    dueDate: todo.getJSDate(5),
    completed: false,
  });
};
const todo = require("../todo"); // Import todo module first
jest.mock("../models", () => ({
  Todo: createTodoMock(),
}));

describe("Tests for functions in todo.js", function () {
  beforeEach(() => {
    // Clear the mock database before each test
    dbMock.clearAll();
  });

  test("Test to add a new todo", async () => {
    const newTodo = await todo.addTask({
      title: "New Todo",
      dueDate: todo.getJSDate(5),
      completed: false,
    });

    expect(newTodo.id).toBeDefined();
    expect(newTodo.title).toBe("New Todo");
    expect(newTodo.completed).toBe(false);
  });

  test("Test to mark a todo as completed", async () => {
    const todoToMark = await todo.addTask({
      title: "Mark as Completed Todo",
      dueDate: todo.getJSDate(3),
      completed: false,
    });

    await todo.markAsComplete(todoToMark.id);

    const updatedTodo = await todo.getTask(todoToMark.id);
    expect(updatedTodo.completed).toBe(true);
  });

  test("Test to retrieve overdue items", async () => {
    const overdueTodoData = {
      title: "Overdue Todo",
      dueDate: todo.getJSDate(-2),
      completed: false,
    };

    // Mock the create method
    TodoMock.create.mockResolvedValue(overdueTodoData);

    const overdueTodo = await todo.addTask(overdueTodoData);

    const overdueItems = await todo.overdue();
    expect(overdueItems.length).toBe(1);
    expect(overdueItems[0].id).toBe(overdueTodo.id);
  });

  test("Test to retrieve due today items", async () => {
    const dueTodayTodoData = {
      title: "Due Today Todo",
      dueDate: todo.getJSDate(0),
      completed: false,
    };

    // Mock the create method
    TodoMock.create.mockResolvedValue(dueTodayTodoData);

    const dueTodayTodo = await todo.addTask(dueTodayTodoData);

    const dueTodayItems = await todo.dueToday();
    expect(dueTodayItems.length).toBe(1);
    expect(dueTodayItems[0].id).toBe(dueTodayTodo.id);
  });

  test("Test to retrieve due later items", async () => {
    const dueLaterTodoData = {
      title: "Due Later Todo",
      dueDate: todo.getJSDate(2),
      completed: false,
    };

    // Mock the create method
    TodoMock.create.mockResolvedValue(dueLaterTodoData);

    const dueLaterTodo = await todo.addTask(dueLaterTodoData);

    const dueLaterItems = await todo.dueLater();
    expect(dueLaterItems.length).toBe(1);
    expect(dueLaterItems[0].id).toBe(dueLaterTodo.id);
  });

  test("Test toDisplayableList function", async () => {
    // Mock some todos in the database
    const todosData = [
      { id: 1, title: "Todo 1", dueDate: todo.getJSDate(1), completed: false },
      { id: 2, title: "Todo 2", dueDate: todo.getJSDate(2), completed: true },
      // Add more as needed
    ];

    // Mock the findAll method
    TodoMock.findAll.mockResolvedValue(todosData);

    const displayableList = await todo.toDisplayableList();

    expect(displayableList.length).toBe(todosData.length);
    // Add more assertions based on the expected format of the displayable list
  });
});
