// todo.js

class Todo {
  constructor(id, title, completed, dueDate) {
    this.id = id;
    this.title = title;
    this.completed = completed;
    this.dueDate = dueDate;
  }

  static createTodo(id, title, dueDate) {
    return new Todo(id, title, false, dueDate);
  }

  markCompleted() {
    this.completed = true;
  }
}

function getOverdueItems(todoList) {
  const currentDate = new Date();
  return todoList.filter(todo => !todo.completed && new Date(todo.dueDate) < currentDate);
}

function getDueTodayItems(todoList) {
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  return todoList.filter(
    todo => !todo.completed && new Date(todo.dueDate).getTime() === currentDate.getTime()
  );
}

function getDueLaterItems(todoList) {
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  return todoList.filter(
    todo => !todo.completed && new Date(todo.dueDate) > currentDate
  );
}

function toDisplayableList(todoList) {
  return todoList.map(todo => ({
    id: todo.id,
    title: todo.title,
    completed: todo.completed,
    dueDate: todo.dueDate ? new Date(todo.dueDate).toLocaleDateString() : null
  }));
}

// Export relevant functions/classes
module.exports = {
  Todo,
  getOverdueItems,
  getDueTodayItems,
  getDueLaterItems,
  toDisplayableList
};
