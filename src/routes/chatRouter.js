const express=require('express')
const { userAuth } = require('../middlewares/auth')
const chatModel = require('../models/chatModel')

const router=express.Router()

router.get('/chat/:targetUser',userAuth,async(req,res)=>{
    const {targetUser}=req.params
    const userId=req.user._id
    try {
       let  chat=await chatModel.findOne({
        partcipants:{$all:[userId,targetUser]}
       }).select({message:{$slice:-20}}).populate({
        path:"message.senderId",
        select:"firstName lastName"
       })
       if(!chat){
        chat=new chatModel({
            partcipants:[userId,targetUser],
            message:[]
        })
        await chat.save()
       }

       res.status(200).json(chat)


    } catch (err) {
        res.status(400).json({message:'ERROR : '+err.message})
        
    }
})

module.exports=router