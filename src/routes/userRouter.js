const express=require('express')
const {userAuth}=require('../middlewares/auth')
const connectionRequestModel=require('../models/connectionRequestModel')
const User=require('../models/userModels')

const router=express.Router()

//getting all the connection request for the user

router.get('/user/requests/received',userAuth,async(req,res)=>{
    try {
        const loggedInUser=req.user

        const connectionRequest=await connectionRequestModel.find({
            toUserId:loggedInUser._id,
            status:'interested'
        }).populate('fromUserId',["firstName",'lastName','photoUrl','age','about','gender'])
        if(!connectionRequest){
            return res.status(500).json({
                message:'there is no connection at all'
            })
        }
        res.status(200).json({data:connectionRequest})
    } catch (error) {
        res.status(500).json({message:'something went wrong check again'})
    }
})

router.get('/user/connections',userAuth,async (req,res)=>{
    try {
        const loggedInUser=req.user;

        const connectionRequest=await connectionRequestModel.find({
            $or: [
                {toUserId:loggedInUser._id, status:'accepted'},
                {fromUserId:loggedInUser._id, status:'accepted'}
            ]
        }).populate('fromUserId',['firstName','lastName','photoUrl','about',])
        .populate('toUserId',["firstName",'lastName','photoUrl','about','age','gender'])

        const data= connectionRequest.map((row) => {
            if (row.fromUserId._id.equals(loggedInUser._id)) {
                return row.toUserId
            }
            return row.fromUserId
        })


        res.status(200).json({data:data})
        
        
    } catch (error) {
        res.status(500).json({message:'something went wrong on connections'})
    }
})

router.get('/feed',userAuth,async(req,res)=>{
    try {

        const loggedInUser=req.user;

        const page=parseInt(req.query.page) || 1
        let limit=parseInt(req.query.limit) || 10
        limit=limit>50 ?50:limit
        const skip=(page-1)*limit

        

        const connectionRequest=await connectionRequestModel.find({
            $or:[
                {fromUserId:loggedInUser._id},
                {toUserId:loggedInUser._id}
            ]
        }).select('fromUserId toUserId')

        const hideUserFromFeed= new Set()
        connectionRequest.forEach((requests)=>{
            hideUserFromFeed.add(requests.fromUserId)
            hideUserFromFeed.add(requests.toUserId)
        })

        const feedUsers=await User.find({
            $and:[
                {_id:{$nin:Array.from(hideUserFromFeed)}},
                {_id:{$ne:loggedInUser._id}}
            ]
        }).select('firstName lastName photoUrl age gender about')
        .skip(skip)
        .limit(limit)
        res.status(200).json({feedUsers})
        
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

module.exports=router;