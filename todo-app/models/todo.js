'use strict';
const {Model} = require('sequelize');
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
            [Op.gt]: new Date(),
          },
        },
      });
    }
    static async dueLater(){
      return this.findAll({
        where: {
          dueDate: {
            [Op.gt]: new Date(),
          },
        },
      });
    }
    static async dueToday(){
      return this.findAll({
        where: {
          dueDate: {
            [Op.gt]: new Date(),
          },
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
    markAsCompleted() {
      return this.update({ completed: true });
    } 
    static deleteTodo(id) {
      return this.destroy({ where: { id } });
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
 Todo.overdue = async () => {
  try {
    const today = new Date();
    const overdueTodos = await Todo.findAll({
      where: {
        dueDate: {
          [Sequelize.Op.lt]: today, // Get todos with dueDate less than today
        },
        completed: false, // Only include incomplete todos
      },
    });
    return overdueTodos;
  } catch (error) {
    throw error;
  }
};

Todo.dueToday = async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set time to the beginning of the day
    const dueTodayTodos = await Todo.findAll({
      where: {
        dueDate: {
          [Sequelize.Op.eq]: today, // Get todos with dueDate equal to today
        },
        completed: false,
      },
    });
    return dueTodayTodos;
  } catch (error) {
    throw error;
  }
};

Todo.dueLater = async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueLaterTodos = await Todo.findAll({
      where: {
        dueDate: {
          [Sequelize.Op.gt]: today, // Get todos with dueDate greater than today
        },
        completed: false,
      },
    });
    return dueLaterTodos;
  } catch (error) {
    throw error;
  }
};
 
  return Todo;  
};
