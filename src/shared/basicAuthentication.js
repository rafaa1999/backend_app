const UserService = require("../user/UserService")
const bcrypt = require("bcrypt")

module.exports = async (req,res,next)=>{
    // take the value of authoriszation from header
    const authorization=req.headers.authorization

    if(authorization){
        // Basic dXNlcjFAZ21haWwuY29tOnBhc3MwNw==  // the value of auth header
        const encoded = authorization.substring(6) // encoded value
        const decoded = Buffer.from(encoded,'base64').toString('ascii') // decoded value
        // user1@gmail.com:pass07
        const[email,password] = decoded.split(':') // give ['user1@gmail.com','pass07']
        const authenticatedUser = await UserService.findByEmail(email) // check the existence of user

        if(authenticatedUser){
            const match = await bcrypt.compare(password,authenticatedUser.password) // check if the password is correct or not 
            if(match){
             req.authenticatedUser = authenticatedUser
            }
        }

    }
    next()
}