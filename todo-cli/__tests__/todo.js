// _tests_/todo.js
const todoList = require('../todo');

test('creates a new todo', () => {
  const todos = todoList();
  todos.add({ title: 'New Task', dueDate: '2023-12-15', completed: false });
  expect(todos.all.length).toBe(1);
});

test('marks a todo as completed', () => {
  const todos = todoList();
  todos.add({ title: 'Task to be completed', dueDate: '2023-12-15', completed: false });
  todos.markAsComplete('Task to be completed');
  const completedItem = todos.all.find(item => item.title === 'Task to be completed');
  expect(completedItem.completed).toBe(true);
});

test('retrieves overdue items', () => {
  const todos = todoList();
  const overdueItems = todos.overdue();
  expect(overdueItems.length).toBe(0);
});

test('retrieves due today items', () => {
  const todos = todoList();
  // Use the current date to ensure the test works consistently
  const currentDate = new Date().toISOString().split('T')[0];
  todos.add({ title: 'Due Today Task', dueDate: currentDate, completed: false });
  const dueTodayItems = todos.dueToday();
  expect(dueTodayItems.length).toBe(1);
  expect(dueTodayItems[0].title).toBe('Due Today Task');
  expect(dueTodayItems[0].completed).toBe(false);
});

test('retrieves due later items', () => {
  const todos = todoList();
  todos.add({ title: 'Due Later Task 1', dueDate: '2023-12-15', completed: false });
  todos.add({ title: 'Due Later Task 2', dueDate: '2023-12-20', completed: false });
  const dueLaterItems = todos.dueLater();
  expect(dueLaterItems.length).toBe(2);
  expect(dueLaterItems[0].title).toBe('Due Later Task 1');
  expect(dueLaterItems[1].title).toBe('Due Later Task 2');
});

test('formats the list for display', () => {
  const todos = todoList();
  const sampleList = [
    { title: 'Sample Task 1', dueDate: '2023-12-15', completed: false },
    { title: 'Sample Task 2', dueDate: '2023-12-16', completed: true },
  ];
  const formattedList = todos.toDisplayableList(sampleList);
  const expectedOutput = '[ ] Sample Task 1 2023-12-15\n[x] Sample Task 2 2023-12-16';
  expect(formattedList).toBe(expectedOutput);
});