const { Sequelize } = require('sequelize');

// init the configuration for 
// each mod-env
    // let configuration={
    //   db:'test-db',
    //   username:'user',
    //   password:'pass',
    //   dialect: 'sqlite',
    //   host: './dev.sqlite',
    //   logging:true
    // }

    // // choose the env
    // if(process.env.NODE_ENV === "production"){
    //   configuration={
    //     db:'prod-db',
    //     username:'prod-user',
    //     password:'prod-pass',
    //     dialect: 'sqlite',
    //     host: './prod.sqlite',
    //     logging:false
    //   }
    // }
const config = require("config")
// get the data form the config (json format)
const configuration=config.get("database") // we choose the right env depend on the env that start in the execution



// create instance to connect to
// database locally
const sequelize = new Sequelize(configuration.db,configuration.username,configuration.password,{
  dialect: configuration.dialect,
  // keep the data on a file
  host: configuration.host,
  // we can run database on memory
  // mode (in the RAM) hence every
  // time the app running the data
  // will go on
  // used for test environment
 // host: ':memory:'
 logging:configuration.logging
});


module.exports= sequelize