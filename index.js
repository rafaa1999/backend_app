const express=require("express")


const sequelize=require("./src/config/database")
const User =require("./src/user/User")
const Article = require("./src/article/Article")
const app = require("./src/app")

// create the database
// async operation then
// we have a promise
// force the database to be
// recreated
sequelize.sync({force:true}).then(async()=>{
    for(let i =1;i<=15;i++){
        const user={
            username:`user${i}`,
            email:`user${i}@gmail.com`,
            password: `pass`
        }
        await User.create(user)
        const article={
            content:`article content ${i}`
        }
        await Article.create(article)
    }
})




app.listen(3000,()=>{
    console.log("server is running")
})


