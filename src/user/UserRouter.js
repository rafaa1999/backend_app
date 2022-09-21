const express=require("express")
const router=express.Router()
const idNumberControl= require("../shared/idNumberControl")
const paggination = require("../shared/pagination")
const UserService = require("./UserService")





// get the api
router.post("/users",async (req,res)=>{
    // insert data to User
    // is an async method
    // take promise
    // or we can use try-catch
    // block
    // User.create(req.body).then(()=>{
    //     res.send("user is inserted")
    // })
    // await User.create(req.body)

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