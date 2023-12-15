'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */ 
    static async addTask(params) {
      return  await Todo.create(params);
    }
    static async overdue() {
      return await Todo.findAll({
        where: {
          dueDate: { [Op.lt]: new Date() },
        },
      });
    }
    static async dueToday() {
      return await Todo.findAll({
        where: {
          dueDate: {
            [Op.between]: [new Date(), new Date(new Date().setHours(23, 59, 59, 999))],
          },
        },
      });
    }
    static async dueLater() {
      return await Todo.findAll({
        where: {
          dueDate: { [Op.gt]: new Date() },
        },
      });
    }
    static async markAsComplete(id) {
      const todo = await Todo.findByPk(id);
      if (todo) {
        todo.completed = true;
        await todo.save();
      }
    }                
    displayableString() {
      let checkbox = this.completed ? '[x]' : '[ ]';

      let dateToday = new Date().toISOString().split('T')[0];

      if (this.dueDate === dateToday) {
        return `${this.id}. ${checkbox} ${this.title}`;
      } else {
        return `${this.id}. ${checkbox} ${this.title} ${this.dueDate}`;
      }
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