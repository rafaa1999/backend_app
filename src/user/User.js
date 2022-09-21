const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database")

class User extends Model {}

User.init({
  // Model attributes are defined here
  username: {
    type: DataTypes.STRING,
  },
  email: {
    type: DataTypes.STRING
  },
  password: {
    type: DataTypes.STRING
  }
}, {
  // Other model options go here
  sequelize, // We need to pass the connection instance
  modelName: 'user', // We need to choose the model name
  timestamps: false // We need to do not show create and update in the base
});


module.exports=User

