const Sequelize = require("sequelize");
const sequelize = new Sequelize(process.env.DB_NAME,process.env.DB_USER,process.env.DB_PASSWORD, {
  host: "db",
  dialect: "mysql",
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;


db.user = require("./user.js")(sequelize, Sequelize);
db.houses = require("./house.js")(sequelize, Sequelize)

module.exports = db;