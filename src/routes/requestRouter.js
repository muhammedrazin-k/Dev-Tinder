const express=require('express')
const { userAuth } = require("../middlewares/auth");
const User=require('../models/userModels');
const connectionRequestModel = require('../models/connectionRequestModel');

const router=express.Router()


router.post('/request/send/:status/:toUserId', userAuth,async (req,res)=>{
    try {

      const fromUserId=req.user._id
      const toUserId=req.params.toUserId;
      const status=req.params.status;

      const existingUser=await User.findById(toUserId)
      if(!existingUser){
        return res.status(400).json({message:'not user found '})
      }

      const allowedStatus=['ignored','interested']
      if(!allowedStatus.includes(status)){
        return res.status(404).json({message:'invalid status type'})
      }

      const existingConnectionRequest=await connectionRequestModel.findOne({
        $or:[
          {fromUserId:fromUserId,toUserId:toUserId},
          {fromUserId:toUserId,toUserId:fromUserId}
        ]
      })
      if(existingConnectionRequest){
        return res.status(500).json({
          message:"connection is already established"
        })
      }

      const connectionRequest=new connectionRequestModel({
        fromUserId,
        toUserId,
        status
      })

      await connectionRequest.save()
      
      res.status(200).json({
        message:req.user.firstName + " is "+status +" on " + existingUser.firstName
      })

     
    } catch (error) {

      res.status(400).json({Message:"something went wrong on connection "+ error.message})
    }
  })

router.post('/request/review/:status/:requrestId',userAuth,async(req,res)=>{
  try {
      const loggedUser=req.user;
      const status=req.params.status

      const allowedStatus=['accepted','rejected']
      if(!allowedStatus.includes(status)){
        return res.status(500).json({message:'not expected status'})
      }

      const findConnection=await connectionRequestModel.findOne({
        _id:req.params.requrestId,
        toUserId:loggedUser._id,
        status:'interested'

      })

      if(!findConnection){
        return res.status(500).json({message:'not found any request'})
      }

      findConnection.status=status;

      const data=await findConnection.save()
      
      res.status(200).json({message:'user is '+status +' your request',
        data:data
      })

  } catch (error) {
    res.status(500).json({message:'something went wrong on request'})
  }
})

module.exports=router;