const express=require("express")
const UserService= require("./src/user/UserService")


const sequelize=require("./src/config/database")
const app = require("./src/app")

sequelize.sync({force:true}).then(async ()=>{
    for(let i=1;i<=5;i++){
        const user={
            username:`user${i}`,
            email:`user${i}@gmail.com`,
            password:`pass07`

        }
       await UserService.create(user)
    }
})


app.listen(3000,()=>{
    console.log("server is running")
})


