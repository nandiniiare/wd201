'use strict';
const {Model} = require('sequelize');
const { Op } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) { 
      // define association here
    }
    static addTodo({title, dueDate}){
      if (!title) {
        throw new Error("Title is required.");
      }
      if (!duedate) {
        throw new Error("Due date is required.");
      }
      return this.create({ title: title, dueDate: dueDate, completed: false})
    }
    static getTodos() {
      return this.findAll();
    }  
    static async overdue(){
      return this.findAll({
        where: {
          completed: false,
          duedate: {
            [Op.lt]: new Date().toISOString().split("T")[0],
          },
        },
      });
    }
    static async dueToday(){
      return this.findAll({
        where: {
          completed: false,
          duedate: {
            [Op.eq]: new Date().toISOString().split("T")[0],
          },
        },
      });
    }
    static async dueLater(){
      return this.findAll({
        where: {
          completed: false,
          duedate: {
            [Op.gt]: new Date().toISOString().split("T")[0],
          }
        },
      });
    }
    static async remove(id){
      return this.destroy({
        where: {
            id,
        },
      });
    }
     static async completedItems() {
      return this.findAll({
        where: {
          completed: true,
        },
        order: [["id", "ASC"]],
      });
    }
    setCompletionStatus(completed) {
      return this.update({ completed: completed });
    } 
  }

  Todo.init({
    title: DataTypes.STRING,
    duedate: DataTypes.DATEONLY,
    completed: DataTypes.BOOLEAN,
 }, {
    sequelize,
    modelName: 'Todo',
 });
  return Todo;  
};