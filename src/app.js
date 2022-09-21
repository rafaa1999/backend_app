
const express=require("express")
const UserRouter=require("./user/UserRouter")
const ArticleRouter = require("./article/ArticleRouter")
const ErrorHandler= require("./error/ErrorHandler")


const app=express()

// middelware
// parse the data 
app.use(express.json())

// const thisWillRunInEveryRequest=(req,res,next)=>{
//     console.log("running the middleware for",req.method,req.originalUrl)
//     next()
// }
// // we will use the function globally
// app.use(thisWillRunInEveryRequest)


// the use of routes
app.use(UserRouter)
app.use(ArticleRouter)


// exception handlers
// the order is essential
// the handlers must be the last
app.use(ErrorHandler)


module.exports=app
