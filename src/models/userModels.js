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
    default:
      "https://img.freepik.com/premium-vector/vector-flat-illustration-grayscale-avatar-user-profile-person-icon-gender-neutral-silhouette-profile-picture-suitable-social-media-profiles-icons-screensavers-as-templatex9xa_719432-2210.jpg?semt=ais_hybrid&w=740",
  },
  about: {
    type: String,
    default: "this a default value",
  },
  skills: {
    type: [String],
  },
},{timestamps:true});

userSchema.methods.getJWT=async function(){

  const user= this ;

  const token=await jwt.sign({id:user._id},"secret123",{expiresIn:"1h"})

  return token

}

userSchema.methods.validatePassword=async function(passwordInput){
  const user=this;

  const isPasswordvalid=await bcrypt.compare(passwordInput,user.password)
  return isPasswordvalid;

}

module.exports = mongoose.model("User", userSchema);
