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
      Todo.belongsTo(models.User, {
        foreignKey: 'userId'
      })
      // define association here
    }
    static addTodo({title, dueDate, userId }){
      return this.create({ title: title, dueDate: dueDate, completed: false, userId });
    }
    static async overdue(userId){
      return this.findAll({
        where: {
          dueDate: {
            [Op.lt]: new Date(),
          },
          userId,
          completed: false,
        },
      });
    }
    static async dueLater(userId){
      return this.findAll({
        where: {
          dueDate: {
            [Op.gt]: new Date(),
          },
          userId,
          completed: false,
        },
      });
    }
    static async dueToday(userId){
      return this.findAll({
        where: {
          dueDate: {
            [Op.eq]: new Date(),
          },
          userId,
          completed: false,
        },
      });
    }
     static completedItems(userId) {
      return this.findAll({
        where: {
          userId,
          completed: true,
        },
        order: [["id", "ASC"]],
      });
    }
    static async remove(id, userId){
      return this.destroy({
        where: {
            id,
            userId
        },
      });
    }
    static async markAsCompleted(id) {
      const todo = await this.findByPk(id);
      if (todo) {
        await todo.setCompletionStatus(true);
        return todo;
      } else {
        throw new Error('Todo not found');
      }
    }    
    static deleteTodo(id) {
      return this.destroy({ where: { id } });
    }
    static getTodos() {
      return this.findAll({ order: [["id", "ASC"]] });
    } 
          
  }
  Todo.prototype.setCompletionStatus = async function (status) {
    this.completed = status;
    await this.save();
  };  
  

  Todo.init({
    title: {
       type: DataTypes.STRING,
       allowNull: false,
       validate: {
          notNull: true,
          len: 5
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