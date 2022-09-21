
const express=require("express")
const router=express.Router()
const Article = require("./Article")
const paggination=require("../shared/pagination")


router.get("/articles",paggination,async (req,res)=>{

    const {page,size} =req.paggination // get values from the paggination middleware

   const articleWithCount = await Article.findAndCountAll({
    limit:size ,// how many item in one page
    offset: page * size ,// the beginning to catch the items
   })
    res.send({
        content:articleWithCount.rows,
        totalPages:Math.ceil( articleWithCount.count / size) // the number of pages
    })
})

module.exports=router