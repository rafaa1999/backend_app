
const express=require("express")
const UserRouter=require("./user/UserRouter")
const ArticleRouter = require("./article/ArticleRouter")
const ErrorHandler= require("./error/ErrorHandler")
// for the internationalization 
const i18next= require("i18next")
const Backend= require("i18next-fs-backend")
const middleware= require("i18next-http-middleware")

// for the internationalization 
i18next.use(Backend).use(middleware.LanguageDetector)
    .init({
        fallbackLng: 'en', // the default language
        backend:{
            loadPath: './locales/{{lng}}/translation.json'
        }
    })


const app=express()
// use i18 as middleware
app.use(middleware.handle(i18next))

// middleware
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
