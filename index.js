const express=require("express")
const UserService= require("./src/user/UserService")
const sequelize=require("./src/config/database")
const app = require("./src/app")

    // choose the environment
    if(process.env.NODE_ENV === "production"){
        sequelize.sync()
    }else{

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
    }




app.listen(3000,()=>{
    console.log("app is running in mode:",process.env.NODE_ENV)
})


