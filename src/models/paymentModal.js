const mongoose=require('mongoose')

const paymentSchema=new mongoose.Schema({

    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    orderId: {
        type: String, // Razorpay order.id
        required: true
      },
  
      paymentId: {
        type: String, // Razorpay payment_id (after success)
        default: null
      },
  
      signature: {
        type: String, // Razorpay signature (after success)
        default: null
      },
  
      amount: {
        type: Number,
        required: true
      },
  
      currency: {
        type: String,
        default: "INR"
      },
  
      membershipType: {
        type: String,
        enum: ["silver", "gold"],
        required: true
      },
      status:{
        type:String,
        required:true
      },
      receipt:{
        type:String,
        required:true
      }
      ,notes:{
        type:Object,
        required:true
      }

},{timestamps:true})

module.exports=mongoose.model('payments',paymentSchema)