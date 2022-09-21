const express=require("express")
const router=express.Router()
const idNumberControl= require("../shared/idNumberControl")
const paggination = require("../shared/pagination")
const UserService = require("./UserService")
const ValidationException= require("../shared/ValidationException")

// ...rest of the initial code omitted for simplicity.
// body and validationResult are functions
const { body, validationResult } = require('express-validator');




// get the api
// body is to check the req 
// specify the message of validation
router.post("/users",
body('username').notEmpty().withMessage("Username can not be null")
.bail() // if username is null hence stop in at this point
.isLength({min:4, max:32}).withMessage("Username must have min 4 and max 32 character"),
body('email').isEmail().withMessage("must be a valid email")
.bail()
// check the uniqueness of the main enter
.custom(async (email)=>{
   const user= await UserService.findByEmail(email)
   if(user){
    throw new Error("this email is in use")
   }
}),
async (req,res,next)=>{

   const errors= validationResult(req) // validate the req
   if(!errors.isEmpty()){
    return next(new ValidationException(errors.array()))
    // return res.status(400).send(errors.array())

   }
    await UserService.create(req.body)
    res.send("user is inserted")
})

// get all users
router.get("/users",paggination,async (req,res)=>{
    // // we don't trust the input of user
    // //  we do some checking of the values

    // const pageAsNumber =Number.parseInt(req.query.page) 
    // const sizeAsNumber =Number.parseInt(req.query.size)

    // let page=0 // as default we initially start from 0

    // if(!Number.isNaN(pageAsNumber) && pageAsNumber>0){
    //         page= pageAsNumber 
    // }

    // let size=10 // as default we initially have 10 items

    // if(!Number.isNaN(sizeAsNumber) && sizeAsNumber<10 && sizeAsNumber>0){
    //     size=sizeAsNumber
    // }
    const page = await UserService.getUsers(req.paggination)
    res.send(page)
})

// get one user
// we use next just to throw error
// to the error handle to catch it
// check the natural of middelware
router.get("/users/:id",idNumberControl, async(req,res,next)=>{

    try {
        const user=await UserService.getUser(req.params.id)
        res.send(user)
    } catch (err) {
        next(err)
    }

})
// update
router.put("/users/:id",idNumberControl, async (req,res)=>{
    await UserService.update(req.params.id,req.body )
   res.send ("user updated")
})
// delete one user
router.delete("/users/:id",idNumberControl, async (req,res)=>{
   await UserService.deleteUser(req.params.id)
    res.send(" user has been deleted")
})


module.exports=router