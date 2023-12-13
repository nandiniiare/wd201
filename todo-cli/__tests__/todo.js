// __tests__/todo.test.js
const { Todo, getOverdueItems, getDueTodayItems, getDueLaterItems, toDisplayableList } = require('../todo');

test('creates a new todo', () => {
  const newTodo = Todo.createTodo(1, 'Test Todo', '2023-12-31');
  expect(newTodo.id).toBe(1);
  expect(newTodo.title).toBe('Test Todo');
  expect(newTodo.completed).toBe(false);
  expect(newTodo.dueDate).toBe('2023-12-31');
});

test('marks a todo as completed', () => {
  const todo = new Todo(1, 'Test Todo', false, '2023-12-31');
  todo.markCompleted();
  expect(todo.completed).toBe(true);
});

test('retrieves overdue items', () => {
  const todoList = [
    new Todo(1, 'Overdue Todo', false, '2022-01-01'),
    new Todo(2, 'Not Overdue Todo', false, '2023-12-31')
  ];
  const overdueItems = getOverdueItems(todoList);
  expect(overdueItems.length).toBe(1);
  expect(overdueItems[0].title).toBe('Overdue Todo');
});

test('retrieves due today items', () => {
  const todoList = [
    new Todo(1, 'Due Today Todo', false, new Date().toLocaleDateString()),
    new Todo(2, 'Not Due Today Todo', false, '2023-12-31')
  ];
  const dueTodayItems = getDueTodayItems(todoList);
  expect(dueTodayItems.length).toBe(1);
  expect(dueTodayItems[0].title).toBe('Due Today Todo');
});

test('retrieves due later items', () => {
  const todoList = [
    new Todo(1, 'Due Later Todo', false, '2023-01-01'),
    new Todo(2, 'Not Due Later Todo', false, new Date().toLocaleDateString())
  ];
  const dueLaterItems = getDueLaterItems(todoList);
  expect(dueLaterItems.length).toBe(1);
  expect(dueLaterItems[0].title).toBe('Due Later Todo');
});

// Additional tests and assertions as needed for toDisplayableList or other functionalities
 
