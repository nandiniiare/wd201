// TodoModel.js
const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("./connectDB.js");

class Todo extends Model {}

Todo.init(
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dueDate: {
      type: DataTypes.DATEONLY,
    },
    complete: {
      type: DataTypes.BOOLEAN,
    },
  },
  {
    sequelize,
    modelName: 'Todo', // optional, but recommended
    tableName: 'todos', // optional, but recommended
  }
);

// Sync the model with the database to create the table
Todo.sync();

module.exports = Todo;
