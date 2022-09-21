
 
/**------------------------pagination middelware----------------------------------- */

module.exports=(req,res,next)=>{
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