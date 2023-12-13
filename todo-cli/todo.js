const todoList = () => {
    let all = [];
  
    const add = (todoItem) => {
      all.push(todoItem);
    };
  
    const markAsComplete = (index) => {
      all[index].completed = true;
    };
  
    const overdue = () => {
      const today = new Date();
      return all.filter(
        (item) => !item.completed && new Date(item.dueDate) < today,
      );
    };
  
    const dueToday = () => {
      const today = new Date().toLocaleDateString();
      return all.filter(
        (item) =>
          !item.completed &&
          new Date(item.dueDate).toLocaleDateString() === today,
      );
    };
  
    const dueLater = () => {
      const today = new Date().toLocaleDateString();
      return all.filter(
        (item) =>
          !item.completed && new Date(item.dueDate).toLocaleDateString() > today,
      );
    };
  
    const toDisplayableList = (list) => {
      let output = "";
      list.forEach((item) => {
        output += `[${item.completed ? "x" : " "}] ${item.title}`;
        if (item.dueDate) {
          output += ` ${item.dueDate}`;
        }
        output += "\n";
      });
      return output;
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
  
  const todos = todoList();
  
  const formattedDate = (d) => {
    return d.toISOString().split("T")[0];
  };
  
  const dateToday = new Date();
  const today = formattedDate(dateToday);
  const yesterday = formattedDate(
    new Date(new Date().setDate(dateToday.getDate() - 1)),
  );
  const tomorrow = formattedDate(
    new Date(new Date().setDate(dateToday.getDate() + 1)),
  );
  
  todos.add({
    title: "Submit assignment",
    dueDate: yesterday,
    completed: false,
  });
  todos.add({ title: "Pay rent", dueDate: today, completed: true });
  todos.add({ title: "Service Vehicle", dueDate: today, completed: false });
  todos.add({ title: "File taxes", dueDate: tomorrow, completed: false });
  todos.add({ title: "Pay electric bill", dueDate: tomorrow, completed: false });
  
  console.log("My Todo-list\n");
  
  console.log("Overdue");
  const overdues = todos.overdue();
  const formattedOverdues = todos.toDisplayableList(overdues);
  console.log(formattedOverdues);
  console.log("\n");
  
  console.log("Due Today");
  const itemsDueToday = todos.dueToday();
  const formattedItemsDueToday = todos.toDisplayableList(itemsDueToday);
  console.log(formattedItemsDueToday);
  console.log("\n");
  
  console.log("Due Later");
  const itemsDueLater = todos.dueLater();
  const formattedItemsDueLater = todos.toDisplayableList(itemsDueLater);
  console.log(formattedItemsDueLater);
  console.log("\n\n"); 
