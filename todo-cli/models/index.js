// models/index.js
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "path/to/your/database.sqlite",
});

module.exports = {
  sequelize,
  Todo: require("./todo"),
};
