const express = require("express")
const router = express.Router()
const idNumberControl = require("../shared/idNumberControl")
const paggination = require("../shared/pagination")
const UserService = require("./UserService")
const ValidationException= require("../shared/ValidationException")
const basicAuthentication = require("../shared/basicAuthentication")

// ...rest of the initial code omitted for simplicity.
// body and validationResult are functions
const { body, validationResult } = require('express-validator');
const User = require("./User")




// get the api
// body is to check the req 
// specify the message of validation
router.post("/users",
body('username').notEmpty().withMessage('username_null')
.bail() // if username is null hence stop in at this point
.isLength({min:4, max:32}).withMessage('username_size'),
body('email').isEmail().withMessage('email_invalid')
.bail()
// check the uniqueness of the main enter
.custom(async (email)=>{
   const user= await UserService.findByEmail(email)
   if(user){
    throw new Error('email_inuse')
   }
}),
async (req,res,next)=>{

   const errors= validationResult(req) // validate the req
   if(!errors.isEmpty()){
    return next(new ValidationException(errors.array()))
    // return res.status(400).send(errors.array())

   }
    await UserService.create(req.body)
    // get the translation
    res.send( {message: req.t('user_create_success')})
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
router.put("/users/:id",idNumberControl,basicAuthentication, async (req,res)=>{
//     // take the value of authoriszation from header
//     const authorization=req.headers.authorization

//     if(!authorization){
//         res.status(403).send({message: "Forbidden there is no authorization header "})
//     }

//    // Basic dXNlcjFAZ21haWwuY29tOnBhc3MwNw==  // the value of auth header
//    const encoded = authorization.substring(6) // encoded value
//    const decoded = Buffer.from(encoded,'base64').toString('ascii') // decoded value
//    // user1@gmail.com:pass07
//    const[email,password] = decoded.split(':') // give ['user1@gmail.com','pass07']

//    const authenticatedUser = await UserService.findByEmail(email) // check the existence of user
//    if(!authenticatedUser){
//     res.status(403).send({message: "Forbidden email doesn't exist  "})
//    }

//    const match = await bcrypt.compare(password,authenticatedUser.password) // check if the password is correct or not 
//    if(!match){
//     res.status(403).send({message: "Forbidden password "})
//    }

    const authenticatedUser = req.authenticatedUser // get the authenticatedUser from the req
    if(!authenticatedUser){
        res.status(403).send({message: "Forbidden there is no auth "}) 
    }

   const id = req.params.id
   if(authenticatedUser.id !==  id){
    res.status(403).send({message: "Forbidden email is different then the id of req "}) // check the id
   } 

   /**----------------simple solution------------------- */
        const user = await User.findOne({where: {id :id}})
        user.username=req.body.username
        // update the base
        await user.save()
    /**----------------simple solution------------------- */

    // await UserService.update(id,req.body )
    res.send ("user updated")
})
// delete one user
router.delete("/users/:id",idNumberControl, async (req,res)=>{
   await UserService.deleteUser(req.params.id)
    res.send(" user has been deleted")
})


module.exports=router