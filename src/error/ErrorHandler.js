module.exports=(err,req,res,next)=>{
    // we throw err from one route
    // and we put right here in
    // the exception handlers
    // to log it
    const errStatus=err.status || 500
    res.status(errStatus).send({
        message:err.message,
        timestamp:Date.now(),
        // specify the origin or error
        path:req.originalUrl
    })
}