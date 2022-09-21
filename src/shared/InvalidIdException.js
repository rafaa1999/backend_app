/**    create function to handel errors and define their status */

module.exports=function InvalidIdException(){
    this.status=400
    this.message="invalid id"
}
