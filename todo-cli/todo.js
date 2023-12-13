/* eslint-disable no-undef */
const todoList = () => {
  const all = [];
  const add = (todoItem) => {
      all.push(todoItem);
  };
  const markAsComplete = (index) => {
      if (index >= 0 && index < all.length) {
          all[index].completed = true;
      } else {
          throw new Error('Invalid index');
      }
  };

  const overdue = () => {
      return all.filter(
          (item) => item.dueDate < new Date().toLocaleDateString("en-CA")
      );
  };

  const dueToday = () => {
      return all.filter(
          (item) => item.dueDate === new Date().toLocaleDateString("en-CA")
      );
  };

  const dueLater = () => {
      return all.filter(
          (item) => item.dueDate > new Date().toLocaleDateString("en-CA")
      );
  };

  const toDisplayableList = (list) => {
      const dsl = [];
      list.forEach((element) => {
          if (element.dueDate === today) {
              if (element.completed === true) {
                  const a = "[x] " + element.title;
                  dsl.push(a);
              } else {
                  const a = "[ ] " + element.title;
                  dsl.push(a);
              }
          } else {
              if (element.completed === true) {
                  const a = "[x] " + element.title + " " + element.dueDate;
                  dsl.push(a);
              } else {
                  const a = "[ ] " + element.title + " " + element.dueDate;
                  dsl.push(a);
              }
          }
      });
      let g = "";
      for (let i = 0; i < dsl.length; i++) {
          // eslint-disable-next-line no-undef
          obj = dsl[i];
          if (i === 0) {
              // eslint-disable-next-line no-undef
              g = g + obj;
          } else {
              // eslint-disable-next-line no-undef
              g = g + "\n" + obj;
          }
      }
      return g;
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
