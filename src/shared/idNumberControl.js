
const InvalidIdException=require("./InvalidIdException")

/**  create middelware which is a function    */
module.exports=(req,res,next)=>{
    const req_id =Number.parseInt(req.params.id)
    
    if(Number.isNaN(req_id)){    
        throw new InvalidIdException()
    }
    // pass to the route handling function 
    // the third parametre
    next() 

}