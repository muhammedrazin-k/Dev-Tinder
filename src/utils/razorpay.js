const Razorpay = require("razorpay");

var instance = new Razorpay({
  key_id: process.env.Razorpay_test_key,
  key_secret:process.env.razorpay_secret_key,
});


module.exports=instance