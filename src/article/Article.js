const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database")

class Article extends Model {}

Article.init({
  // Model attributes are defined here
  content: {
    type: DataTypes.STRING,
  },
 
}, {
  // Other model options go here
  sequelize, // We need to pass the connection instance
  modelName: 'article', // We need to choose the model name

});


module.exports=Article

