const jwt=require('jsonwebtoken')
const User=require('../models/userModels')

const userAuth=async(req,res,next)=>{
    try{

        const {token}=req.cookies
        if(!token){
            return res.status(401).send('invalid token')
        }
        const decodeData=await jwt.verify(token,"secret123")
        const{id}=decodeData
        
        const user=await User.findById(id)
        if(!user){
            throw new Error('invalid user')
        }

        req.user=user
        next()
    } catch(err){
        res.status(500).send('ERROR:' + err.message)
    }


}

module.exports={userAuth}