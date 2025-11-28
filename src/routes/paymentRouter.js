const express = require("express");
const { userAuth } = require("../middlewares/auth");
const razorpayInstance = require("../utils/razorpay");
const paymentModal = require("../models/paymentModal");
const membershipAmount = require("../utils/constants");
const { validateWebhookSignature } = require("razorpay/dist/utils/razorpay-utils");
const userModels = require("../models/userModels");

const router = express.Router();

router.post("/payment/create", userAuth, async (req, res) => {
  try {

    const {membershipType}=req.body
    const {firstName,lastName,EmailId}=req.user

   const order= await razorpayInstance.orders.create({
      amount: membershipAmount[membershipType]*100,
      currency: "INR",
      receipt: "receipt#1",
      notes: {
        firstName,
        lastName,
        EmailId,
        membershipType:membershipType
      },
    });

    //save to database 
    console.log(order)

    const payment=new paymentModal({
        userId:req.user._id,
        orderId:order.id,
        status:order.status,
        amount:order.amount,
        currency:order.currency,
        receipt:order.receipt,
        notes:order.notes,

        membershipType:order.notes.membershipType
    })

    const savedPayment=await payment.save()

    //give response back 

    res.json({...savedPayment.toJSON(),keyId:process.env.Razorpay_test_key})
  } catch (err) {
    res.status(200).json({ message: "ERROR : " + err.message });
  }
});

 router.post('/payment/webhook',async(req,res)=>{
    try {
        const webhooksignatr=req.headers['x-razorpay-signature']

        const iswebhookValid=validateWebhookSignature(
            JSON.stringify(req.body),webhooksignatr,
            process.env.webhook_secret
        )

        if(!iswebhookValid){
            return res.status(400).json({message:'webhook signature is invalid'})
        }

        //updating the payment status

        const paymentDetails=req.body.payload.payment.entity

        const payment = await paymentModal.findOne({orderId:paymentDetails.order_id})
        if(!payment){
            return res.status(400).json({message:"invalid payment recipt"})
        }
        
        payment.status=paymentDetails.status
        await payment.save()

        // update user as premium

        const user=await userModels.findOne({_id:payment.userId})
        user.isPremium=true
        user.membershipType=payment.notes.membershipType
        await user.save()


        return res.status(200).json({message:'webhook received successfully'})
    } catch (err) {
        res.status(200).json({message:"ERROR: "+err.message})
        
    }
 })

 router.get('/premium/verify',userAuth,async(req,res)=>{
    try {
        const user=req.user
        if(user.isPremium){
            return res.json({isPremium:true})
        }
        return res.json({isPremium:false})

    } catch (err) {
        res.status(400).json({message:"ERROR: "+err.message})
        
    }
 })
module.exports = router;
