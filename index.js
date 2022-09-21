const express=require("express")


const sequelize=require("./src/config/database")
const app = require("./src/app")

sequelize.sync({force:true})


app.listen(3000,()=>{
    console.log("server is running")
})


