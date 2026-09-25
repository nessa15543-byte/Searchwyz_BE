const admin = (req, res) =>{
    try{
        const email = req.body.email
    }catch(error){
        res.status(400).json({error:error.message})
    }
}