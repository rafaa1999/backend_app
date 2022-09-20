const express=require("express")

const sequelize=require("./database")
const User =require("./User")

// create the database
// async operation then
// we have a promise
// force the database to be
// recreated
sequelize.sync({force:true}).then(()=>{console.log("database is steady")})

const app=express()

// middelware
// parse the data 
app.use(express.json())

app.post("/users",async (req,res)=>{
    // insert data to User
    // is an async method
    // take promise
    // or we can use try-catch
    // block
    // User.create(req.body).then(()=>{
    //     res.send("user is inserted")
    // })

    await User.create(req.body)
    res.send("user is inserted")
})

app.get("/users",async (req,res)=>{
   const users = await User.findAll()
    res.send(users)
})
// get one user
app.get("/users/:id",async (req,res)=>{
    const req_id =req.params.id
   const user = await User.findOne({where: {id : req_id}})
    res.send(user)
})
// update
app.put("/users/:id",async (req,res)=>{
    const req_id =req.params.id
   const user = await User.findOne({where: {id : req_id}})
   user.username=req.body.username
   // update the base
   await user.save()
   res.send ("user updated")
})
// delete one user
app.delete("/users/:id",async (req,res)=>{
    const req_id =req.params.id
    await User.destroy({where: {id : req_id}})
    res.send(" user has been deleted")
})

app.listen(3000,()=>{
    console.log("server is running")
})