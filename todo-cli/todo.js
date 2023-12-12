/* eslint-disable no-undef */

const todoList = () => {
    all = [];
    const add = (todoItem) => {
      all.push(todoItem);
    };
    const markAsComplete = (index) => {
      all[index].completed = true;
    };
  
    const overdue = () => {
      let today = new Date().toLocaleDateString("en-CA");
      // Write the date check condition here and return the array of overdue items accordingly.
      // FILL YOUR CODE HERE
      // ..
      // ..
      // ..
      return all.filter((todo) => todo.dueDate < today);
    };
  
    const dueToday = () => {
      let today = new Date().toLocaleDateString("en-CA");
      // Write the date check condition here and return the array of todo items that are due today accordingly.
      // FILL YOUR CODE HERE
      // ..
      // ..
      // ..
      return all.filter((todo) => todo.dueDate == today);
    };
  
    const dueLater = () => {
      let today = new Date().toLocaleDateString("en-CA");
      // Write the date check condition here and return the array of todo items that are due later accordingly.
      // FILL YOUR CODE HERE
      // ..
      // ..
      // ..
      return all.filter((todo) => todo.dueDate > today);
    };
  
    const toDisplayableList = (list) => {
      let today = new Date().toLocaleDateString("en-CA");
      // Format the To-Do list here, and return the output snvmtring as per the format given above.
      // FILL YOUR CODE HERE
      // ..
      // ..
      // ..
      // return OUTPUT_STRING
      return list
        .map(
          (todo) =>
            `${todo.completed ? "[x]" : "[ ]"} ${todo.title} ${
              todo.dueDate == today ? "" : todo.dueDate
            }`,
        )
        .join("\n");
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
  
  // ####################################### #
  // DO NOT CHANGE ANYTHING BELOW THIS LINE. #
  // ####################################### #
  module.exports = todoList;