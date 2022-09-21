module.exports=(err,req,res,next)=>{
   
    const {status,message,errors}= err
    let ValidationErrors
    if(errors){
        ValidationErrors= {}
        errors.forEach(errors => {
            ValidationErrors[errors.param]= errors.msg
        });
    }
    res.status(status).send({
        message:message,
        timestamp:Date.now(),
        // specify the origin or error 
        path:req.originalUrl,
        ValidationErrors
    })
}