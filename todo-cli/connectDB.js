// connectDB.js

const Sequelize = require("sequelize");

const database = "todo_db";
const username = "postgres";
const password = "Surya@57";
const sequelize = new Sequelize(database, username, password, {
  host: "localhost",
  dialect: "postgres",
});

const connect = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

module.exports = {
  connect,
  sequelize,
};
