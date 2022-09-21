module.exports=function ValidationException(errors){
    this.status=400
    this.message="invalid request"
    this.errors=errors
}
