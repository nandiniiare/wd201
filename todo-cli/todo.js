// todo.js
const todoList = () => {
  const all = [];
  
  const add = (todoItem) => {
    all.push(todoItem);
  };
  
  const markAsComplete = (title) => {
    const foundItem = all.find(item => item.title === title);
    if (foundItem) {
      foundItem.completed = true;
    } else {
      console.error(Todo item with title ${title} not found.);
    }
  };

  const overdue = () => {
    const today = new Date();
    return all.filter(item => new Date(item.dueDate) < today);
  };

  const dueToday = () => {
    const today = new Date();
    return all.filter(item => new Date(item.dueDate).getDate() === today.getDate());
  };

  const dueLater = () => {
    const today = new Date();
    return all.filter(item => new Date(item.dueDate).getDate() > today.getDate());
  };

  const toDisplayableList = (list) => {
    return list.map(item => {
      const status = item.completed ? '[x]' : '[ ]';
      return ${status} ${item.title} ${item.dueDate};
    }).join('\n');
  };

  return {
    all,
    add,
    markAsComplete,
    overdue,
    dueToday,
    dueLater,
    toDisplayableList,
  };
};

module.exports = todoList;