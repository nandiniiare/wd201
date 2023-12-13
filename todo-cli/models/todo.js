// models/todo.js
'use strict';
const {Model,DataTypes} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static async addTask(params) {
      return await Todo.create(params);
    }
    static async showList() {
      console.log("My Todo list \n");

      console.log("Overdue");
      let over = await Todo.overdue();
      console.log(over.map((items) => items.displayableString()).join('\n'));
      console.log("\n");

      console.log("Due Today");
      let tod = await Todo.dueToday();
      console.log(tod.map((items) => items.displayableString()).join('\n'));
      console.log("\n");

      console.log("Due Later");
      let later = await Todo.dueLater();
      console.log(later.map((items) => items.displayableString()).join('\n'));
    }

    static today = new Date().toISOString().split("T")[0];

    static async overdue() {
      const over = await Todo.findAll({
        where:{
          dueDate: {
            [sequelize.Sequelize.Op.lt] : Todo.today
          }
        }
      });
      return over;
    }

    static async dueToday() {
      const tod = await Todo.findAll({
        where:{
          dueDate: Todo.today
        }
      });
      return tod;
    }

    static async dueLater() {
      let tom = new Date().setDate(new Date().getDate()+1);
      const lat = await Todo.findAll({
        where:{
          dueDate: {
            [sequelize.Sequelize.Op.gte] : tom
          }
        }
      });
      return lat;
    }

    static async markAsComplete(id) {
      const item = await Todo.findByPk(id);
      
      if(item){
        item.completed = true;
        await item.save();
      }
      console.log("Item not Found !");
    }

    displayableString() {
      const status = this.completed ? '[x]' : '[ ]';

      let dueDateString = '';
    if (this.dueDate instanceof Date) {
      dueDateString = this.dueDate.toISOString().split('T')[0];
    }

    return `${this.id}. ${status} ${this.title} ${dueDateString}`;
    }
  }
  Todo.init({
    title: DataTypes.STRING,
    dueDate: DataTypes.DATEONLY,
    completed: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Todo',
  });
  return Todo;
};