 const auth = (req,res,next)=>{
    if(req.session.userlogin)
    {
        next()
    }
    else{
        res.redirect('/')
    }
}

module.exports ={auth}