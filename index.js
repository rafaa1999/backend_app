const express=require("express")


const sequelize=require("./database")
const User =require("./User")
const Article=require("./article")

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

const app=express()

// middelware
// parse the data 
app.use(express.json())

const thisWillRunInEveryRequest=(req,res,next)=>{
    console.log("running the middleware for",req.method,req.originalUrl)
    next()
}
// we will use the function globally
app.use(thisWillRunInEveryRequest)

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

/**------------------------pagination middelware----------------------------------- */

                const paggination=(req,res,next)=>{
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

                    // send new values of page and size in the req object
                    req.paggination={
                        page:page,
                        size:size
                    }

                    next() // next function the third parametre
                }
/**------------------------pagination middelware----------------------------------- */



app.get("/users",paggination,async (req,res)=>{
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

    const {page,size} =req.paggination // get values from the paggination middleware

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

/**  create middelware which is a function    */
const idNumberControl=(req,res,next)=>{
    const req_id =Number.parseInt(req.params.id)
    
    if(Number.isNaN(req_id)){    
        throw new InvalidIdException()
    }
    // pass to the route handling function 
    // the third parametre
    next() 

}





// get one user
// we use next just to throw error
// to the error handle to catch it
// check the natural of middelware
app.get("/users/:id",idNumberControl, async(req,res,next)=>{
    const req_id=req.params.id
   const user = await User.findOne({where: {id : req_id}})
    // check the use exit or not
    if(!user){
        // next(new Error("user not found"))
        next(new  UserNotFoundException())
    }
    res.send(user)
})
// update
app.put("/users/:id",idNumberControl, async (req,res)=>{
    const req_id =req.params.id
   const user = await User.findOne({where: {id : req_id}})
   user.username=req.body.username
   // update the base
   await user.save()
   res.send ("user updated")
})
// delete one user
app.delete("/users/:id",idNumberControl, async (req,res)=>{
    const req_id =req.params.id
    await User.destroy({where: {id : req_id}})
    res.send(" user has been deleted")
})

/**------------------------------------------------ ARTICLES------------------------------------------------------ */
// get all articles
app.get("/articles",paggination,async (req,res)=>{

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
// get one article
app.get("/articles/:id",idNumberControl, async(req,res,next)=>{
    const req_id=req.params.id
   const article = await Article.findOne({where: {id : req_id}})
    // check the use exit or not
    if(!article){
        // next(new Error("user not found"))
        next(new  UserNotFoundException())
    }
    res.send(article)
})
// update article
app.put("/articles/:id",idNumberControl, async (req,res)=>{
    const req_id =req.params.id
   const article = await Article.findOne({where: {id : req_id}})
   article.content=req.body.content
   // update the base
   await article.save()
   res.send ("article updated")
})
// delete one article
app.delete("/articles/:id",idNumberControl, async (req,res)=>{
    const req_id =req.params.id
    await Article.destroy({where: {id : req_id}})
    res.send(" article has been deleted")
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