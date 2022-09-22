module.exports=(err,req,res,next)=>{
   
    const {status,message,errors}= err
    let ValidationErrors
    if(errors){
        ValidationErrors= {}
        errors.forEach(errors => {
            ValidationErrors[errors.param]= req.t(errors.msg)
        });
    }
    res.status(status).send({
        message:req.t(message),
        timestamp:Date.now(),
        // specify the origin or error 
        path:req.originalUrl,
        ValidationErrors
    })
}