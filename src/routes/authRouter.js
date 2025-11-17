
const express=require('express')
const { validation } = require("../utils/validation.js");
const bcrypt = require("bcrypt");
const User = require("../models/userModels.js");


const router=express.Router()

router.post("/signup", async (req, res) => {
    const {
      firstName,
      lastName,
      EmailId,
      password,
      gender,
      age,
      about,
      photoUrl,
      skills,
    } = req.body;
    try {
      validation(req);
      //  hashing password
  
      const hashedpassword = await bcrypt.hash(password, 10);
  
      const user = new User({
        firstName,
        lastName,
        EmailId,
        password: hashedpassword,
        gender,
        age,
        about,
        photoUrl,
        skills,
      });

      
      const savedUser= await user.save();
      const token=await savedUser.getJWT()
      
      res.cookie("token",token).json({message:"user added succesfully", data:savedUser});
    } catch (err) {
      res.status(400).send("ERROR :" + err.message);
    }
  });

router.post("/login", async (req, res) => {
    try {
      const { EmailId, password } = req.body;
  
      const userdata = await User.findOne({ EmailId:EmailId });
      if (!userdata) {
        throw new Error(" invalid credential..!");
      }
  
      const isPasswordvalid = await userdata.validatePassword(password)
  
      if (!isPasswordvalid) {
        throw new Error("invalid user credential...!");
      } else {
        const token = await userdata.getJWT()
  
        res.cookie("token", token).json(userdata);
      }
    } catch (err) {
      res.status(500).send("ERROR :" + err.message);
    }
  });

router.post('/logout',async (req,res)=>{
    try {
        res.cookie('token',null,{expires:new Date(Date.now())})
        .send('logged out successfully')
    } catch (error) {
        res.json({message:"something went wrong"})
    }
})


module.exports=router;