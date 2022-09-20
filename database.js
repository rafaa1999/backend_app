const { Sequelize } = require('sequelize');

// create instance to connect to
// database locally
const sequelize = new Sequelize("test-db","user","pass",{
  dialect: 'sqlite',
  // keep the data on a file
  host: './dev.sqlite'
  // we can run database on memory
  // mode (in the RAM) hence every
  // time the app running the data
  // will go on
  // used for test environment
 // host: ':memory:'
});


module.exports= sequelize