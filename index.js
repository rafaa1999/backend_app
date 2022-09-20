const express=require("express")


const sequelize=require("./database")
const User =require("./User")

// create the database
// async operation then
// we have a promise
// force the database to be
// recreated
sequelize.sync({force:true}).then(async()=>{
    for(let i =1;i<=5;i++){
        const user={
            username:`user${i}`,
            email:`user${i}@gmail.com`,
            password: `pass`
        }
        await User.create(user)
    }
})

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
    // we don't trust the input of user
    //  we do some checking of the values

    const pageAsNumber =Number.parseInt(req.query.page) 
    const sizeAsNumber =Number.parseInt(req.query.size)

    let page=0 // as default we initially start from 0

    if(!Number.isNaN(pageAsNumber) && pageAsNumber>0){
            page= pageAsNumber 
    }

    let size=10 // as default we initially have 10 items

    if(!Number.isNaN(sizeAsNumber) && sizeAsNumber<10 && sizeAsNumber>0){
        size=sizeAsNumber
    }


    // get query for the url
    // const page =req.query.page
    // const size=req.query.size

    // findAndCountAll give the number
    // of items
   const users = await User.findAndCountAll({
    limit:size ,// how many item in one page
    offset: page * size ,// the beginning to catch the items
   })
    res.send({
        content:users.rows,
        totalPages:Math.ceil( users.count / size) // the number of pages
    })
})

/**    create function to handel errors and define their status */

function InvalidIdException(){
    this.status=400
    this.message="invalid id"
}

function UserNotFoundException(){
    this.status=404
    this.message="use not found"
}




// get one user
// we use next just to throw error
// to the error handle to catch it
app.get("/users/:id", async(req,res,next)=>{

    const req_id =Number.parseInt(req.params.id)
    
    if(Number.isNaN(req_id)){    
        // res.status(400).send({message:"invalid id"})
        // next is a function
        // next(new Error("invalid id"))
        next(new InvalidIdException())
    }

   const user = await User.findOne({where: {id : req_id}})
    // check the use exit or not
    if(!user){
        // next(new Error("user not found"))
        next(new  UserNotFoundException())
    }
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

// exception handlers
// the order is essential
// the handlers must be the last
app.use((err,req,res,next)=>{
    // we throw err from one route
    // and we put right here in
    // the exception handlers
    // to log it
    res.status(err.status).send({
        message:err.message,
        timestamp:Date.now(),
        // specify the origin or error
        path:req.originalUrl
    })
})

app.listen(3000,()=>{
    console.log("server is running")
})