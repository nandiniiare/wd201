'use strict';
const {Model} = require('sequelize');
const { Op } = require('sequelize');
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('database', 'username', 'password', {
  dialect: 'postgres', // or 'postgres' or 'sqlite' or 'mssql'
  // other options...
});
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
      return this.create({ title: title, dueDate: dueDate, completed: false})
    }
    static async overdue(){
      return this.findAll({
        where: {
          dueDate: {
            [Op.gt]: new Date().toLocaleDateString("en-CA"),
          },
          completed: false,
        },
        order: [["id", "ASC"]],
      });
    }
    static async dueLater(){
      return this.findAll({
        where: {
          dueDate: {
            [Op.gt]: new Date().toLocaleDateString("en-CA"),
          },
          completed: false,
        },
        order: [["id", "ASC"]],
      });
    }
    static async dueToday(){
      return this.findAll({
        where: {
          dueDate: {
            [Op.gt]: new Date().toLocaleDateString("en-CA"),
          },
          completed: false,
        },
        order: [["id", "ASC"]],
      });
    }
     static completedItems() {
      return this.findAll({
        where: {
          completed: true,
        },
        order: [["id", "ASC"]],
      });
    }
    
    markAsCompleted() {
      return this.update({ completed: true });
    } 
    static deleteTodo(id) {
      return this.destroy({ where: { id } });
    }
    static getTodos() {
      return this.findAll({ order: [["id", "ASC"]] });
    }       
  }
  
  // Add this method to the Todo model
Todo.prototype.setCompletionStatus = async function (status) {
  this.completed = status;
  await this.save();
};

  Todo.init({
    title: {
       type: DataTypes.STRING,
       allowNull: false,
       validate: {
          notEmpty: true,
       },
    },
    dueDate: {
       type: DataTypes.DATEONLY,
       allowNull: false,
       validate: {
          isDate: true,
       },
    },
    completed: {
       type: DataTypes.BOOLEAN,
       defaultValue: false,
    },
 }, {
    sequelize,
    modelName: 'Todo',
 });
 
 
  return Todo;  
};