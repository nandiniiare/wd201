const { todoList, formattedDate } = require('../todo-cli/todo');

describe('Todo List Tests', () => {
  let todos;

  beforeEach(() => {
    todos = todoList();
    const dateToday = new Date();
    const today = formattedDate(dateToday);
    const yesterday = formattedDate(
      new Date(new Date().setDate(dateToday.getDate() - 1)),
    );
    const tomorrow = formattedDate(
      new Date(new Date().setDate(dateToday.getDate() + 1)),
    );

    todos.add({
      title: 'Submit assignment',
      dueDate: yesterday,
      completed: false,
    });
    todos.add({ title: 'Pay rent', dueDate: today, completed: true });
    todos.add({ title: 'Service Vehicle', dueDate: today, completed: false });
    todos.add({ title: 'File taxes', dueDate: tomorrow, completed: false });
    todos.add({
      title: 'Pay electric bill',
      dueDate: tomorrow,
      completed: false,
    });
  });

  test('should retrieve overdue items', () => {
    const overdues = todos.overdue();
    expect(overdues.length).toBe(1);
    expect(overdues[0].title).toBe('Submit assignment');
  });

  test('should retrieve items due today', () => {
    const itemsDueToday = todos.dueToday();
    expect(itemsDueToday.length).toBe(2);
    expect(itemsDueToday.map((item) => item.title)).toEqual([
      'Pay rent',
      'Service Vehicle',
    ]);
  });

  test('should retrieve items due later', () => {
    const itemsDueLater = todos.dueLater();
    expect(itemsDueLater.length).toBe(2);
    expect(itemsDueLater.map((item) => item.title)).toEqual([
      'File taxes',
      'Pay electric bill',
    ]);
  });

  test('should mark a todo as completed', () => {
    todos.markAsComplete(0);
    expect(todos.all[0].completed).toBe(true);
  });

  test('should add a new todo', () => {
    todos.add({
      title: 'New Task',
      dueDate: '2023-01-10',
      completed: false,
    });
    expect(todos.all.length).toBe(6);
    expect(todos.all[5].title).toBe('New Task');
  });

  test('should format items for display', () => {
    const items = [
      { title: 'Task 1', dueDate: '2023-01-01', completed: false },
      { title: 'Task 2', dueDate: '2023-01-02', completed: true },
    ];
    const displayableList = todos.toDisplayableList(items);
    const expectedOutput =
      '[ ] Task 1 2023-01-01\n[x] Task 2 2023-01-02\n';
    expect(displayableList).toBe(expectedOutput);
  });

  // Add more test cases as needed
});
