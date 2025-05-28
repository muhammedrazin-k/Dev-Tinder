const mongoose=require('mongoose')

const connectionRequestSchema=new mongoose.Schema({
    fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User"
    },
    toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    status:{
        type:String,
        required:true,
        enum:{
            values:['ignored','interested','accepted','rejected']
        }
    }

},{timestamps:true})

connectionRequestSchema.pre("save",function(next){
    const conections=this

    if(conections.fromUserId.equals(conections.toUserId)){
        throw new Error('do not  conect your self')
    }
    next()
})

connectionRequestSchema.index({fromUserId:1, toUserId:1})
connectionRequestSchema.index({ toUserId:1,fromUserId:1})


module.exports=mongoose.model('connectionRequest',connectionRequestSchema)