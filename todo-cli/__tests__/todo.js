// __tests__/todo.js
const SequelizeMock = require("sequelize-mock");
const dbMock = new SequelizeMock();
const todo = require("../todo");

describe("Tests for functions in todo.js", function () {
  beforeAll(async () => {
    await dbMock.sync({ force: true });
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

    const updatedTodo = await dbMock.Todo.findByPk(todoToMark.id);
    expect(updatedTodo.completed).toBe(true);
  });

  test("Test to retrieve overdue items", async () => {
    const overdueTodo = await todo.addTask({
      title: "Overdue Todo",
      dueDate: todo.getJSDate(-2),
      completed: false,
    });

    const overdueItems = await todo.overdue();
    expect(overdueItems.length).toBe(1);
    expect(overdueItems[0].id).toBe(overdueTodo.id);
  });

  test("Test to retrieve due today items", async () => {
    const dueTodayTodo = await todo.addTask({
      title: "Due Today Todo",
      dueDate: todo.getJSDate(0),
      completed: false,
    });

    const dueTodayItems = await todo.dueToday();
    expect(dueTodayItems.length).toBe(1);
    expect(dueTodayItems[0].id).toBe(dueTodayTodo.id);
  });

  test("Test to retrieve due later items", async () => {
    const dueLaterTodo = await todo.addTask({
      title: "Due Later Todo",
      dueDate: todo.getJSDate(2),
      completed: false,
    });

    const dueLaterItems = await todo.dueLater();
    expect(dueLaterItems.length).toBe(1);
    expect(dueLaterItems[0].id).toBe(dueLaterTodo.id);
  });

  // Additional Test Cases

  test("Test to mark a completed todo as incomplete", async () => {
    const completedTodo = await todo.addTask({
      title: "Completed Todo",
      dueDate: todo.getJSDate(1),
      completed: true,
    });

    await todo.markAsIncomplete(completedTodo.id);

    const updatedTodo = await dbMock.Todo.findByPk(completedTodo.id);
    expect(updatedTodo.completed).toBe(false);
  });

  test("Test to retrieve completed items", async () => {
    const completedTodo = await todo.addTask({
      title: "Completed Todo",
      dueDate: todo.getJSDate(1),
      completed: true,
    });

    const completedItems = await todo.completed();
    expect(completedItems.length).toBe(1);
    expect(completedItems[0].id).toBe(completedTodo.id);
  });

  test("Test to retrieve items that are not completed", async () => {
    const incompleteTodo = await todo.addTask({
      title: "Incomplete Todo",
      dueDate: todo.getJSDate(3),
      completed: false,
    });

    const incompleteItems = await todo.incomplete();
    expect(incompleteItems.length).toBe(1);
    expect(incompleteItems[0].id).toBe(incompleteTodo.id);
  });
});
