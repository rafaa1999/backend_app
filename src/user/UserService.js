const User = require("./User")
const UserNotFoundException=require("./UserNotFoundException")



// do all the services that related
// to UserRouter
const create=async (user)=>{
    await User.create(user)
}

const getUsers=async(paggination)=>{
    
    const {page,size} =paggination // get values from the paggination middleware

    // get query for the url
    // const page =req.query.page
    // const size=req.query.size

    // findAndCountAll give the number
    // of items
   const users = await User.findAndCountAll({
    limit:size ,// how many item in one page
    offset: page * size ,// the beginning to catch the items
   })
        return{
        content:users.rows,
        totalPages:Math.ceil( users.count / size) // the number of pages
    }
}

const getUser=async(id)=>{
    const user = await User.findOne({where: {id : id}})
     // check the use exit or not
     if(!user){
         // next(new Error("user not found"))
         throw new  UserNotFoundException()
     }
     return user
}

const update=async (id,body)=>{

    const user = await User.findOne({where: {id :id}})
    user.username=body.username
    // update the base
    await user.save()
}

const deleteUser=async(id)=>{
    await User.destroy({where: {id :id}})
}

module.exports={
    create,
    getUsers,
    getUser,
    update,
    deleteUser
}

