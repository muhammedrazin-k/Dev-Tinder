const mongoose = require("mongoose");
const validator=require("validator")
const jwt=require('jsonwebtoken')
const bcrypt=require('bcrypt')

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    minlength: 3,
    maxlength: 14,
    required: true,
  },
  lastName: { type: String },
  EmailId: {
    type: String,
    required: true,
    lowercase:true,
    trim:true,
    unique: true,
    validate(value){
      if(!validator.isEmail(value)){
        throw new Error( "invalid Email")
      }
    }
  },
  password: { 
    type: String,
    required:true,
   
    validate(value){
      if(!validator.isStrongPassword(value)){
        throw new Error( 'make your password srong')
      }
    }
  
  },
  age: {
     type: Number,
     min:16
     },
  gender: { 
    type: String ,
    lowercase:true,
    validate(value){
        if(!["male","female","others"].includes(value)){
            throw new Error('gender data is not valid')
        }
    }

  },

  photoUrl: {
    type: String,
    default: "https://www.freepik.com/free-vector/blue-circle-with-white-user_145857007.htm#fromView=search&page=1&position=0&uuid=80b1c36e-dbeb-4dda-aa81-aed908e7d484&query=User+Profile+small+image",
  },
  about: {
    type: String,
    default: "this was the one of the most valueable about section in field",
  },
  skills: {
    type: [String],
  },
  isPremium:{
    type:Boolean,
    default:false
  },
  membershipType:{
    type:String
  }
},{timestamps:true});

userSchema.methods.getJWT=async function(){

  const user= this ;

  const token=await jwt.sign({id:user._id},process.env.jwt_secret,{expiresIn:"1d"})

  return token

}

userSchema.methods.validatePassword=async function(passwordInput){
  const user=this;

  const isPasswordvalid=await bcrypt.compare(passwordInput,user.password)
  return isPasswordvalid;

}

module.exports = mongoose.model("User", userSchema);
