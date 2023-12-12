// todo.js
const db = require("./models");

const getJSDate = (days) => {
  if (!Number.isInteger(days)) {
    throw new Error("Need to pass an integer as days");
  }
  const today = new Date();
  const oneDay = 60 * 60 * 24 * 1000;
  return new Date(today.getTime() + days * oneDay);
};

const addTask = async ({ title, dueDate, completed }) => {
  // Implement the logic to add a new task to the database
  // You can use db.Todo.create() or any appropriate method
  const newTodo = await db.Todo.create({
    title,
    dueDate,
    completed,
  });
  return newTodo;
};

const markAsComplete = async (taskId) => {
  // Implement the logic to mark a task as completed in the database
  await db.Todo.update({ completed: true }, { where: { id: taskId } });
};

const overdue = async () => {
  // Implement the logic to retrieve overdue tasks from the database
  const overdueItems = await db.Todo.findAll({
    where: {
      dueDate: { [db.Sequelize.Op.lt]: new Date() },
      completed: false,
    },
  });
  return overdueItems;
};

const dueToday = async () => {
  // Implement the logic to retrieve tasks due today from the database
  const dueTodayItems = await db.Todo.findAll({
    where: {
      dueDate: { [db.Sequelize.Op.eq]: new Date() },
      completed: false,
    },
  });
  return dueTodayItems;
};

const dueLater = async () => {
  // Implement the logic to retrieve tasks due later from the database
  const dueLaterItems = await db.Todo.findAll({
    where: {
      dueDate: { [db.Sequelize.Op.gt]: new Date() },
      completed: false,
    },
  });
  return dueLaterItems;
};

const toDisplayableList = (todos) => {
  // Implement the logic to convert todos to a displayable list
  // Return the formatted list
  return todos.map((todo) => ({
    id: todo.id,
    title: todo.title,
    dueDate: todo.dueDate,
    completed: todo.completed,
  }));
};

module.exports = {
  getJSDate,
  addTask,
  markAsComplete,
  overdue,
  dueToday,
  dueLater,
  toDisplayableList,
};
