const express=require('express')
const { userAuth } = require("../middlewares/auth");
const {validateProfileData}=require('../utils/validation')
const bcrypt=require('bcrypt')
const validator=require('validator')

const router=express.Router()


router.get("/profile/view", userAuth, async (req, res) => {
    try {
      const user = req.user;
  
      res.json(user);
    } catch (err) {
      res.status(401).send("ERROR: " + err.message);
    }
  });


router.patch('/profile/edit',userAuth,async (req,res)=>{
    try {

       if(!validateProfileData(req)){
        throw new Error('invalid edit field')
       }

       const loggedUser=req.user
       
       Object.keys(req.body).forEach(keys=>loggedUser[keys]=req.body[keys])

       console.log(loggedUser)
       await loggedUser.save()
       res.status(200).json({message:'successfully edited profile data',data:loggedUser})
        
    } catch (error) {
      res.status(500).json({message:"something went wrong"+error.message})
    }
})

router.patch('/profile/editpassword',userAuth,async(req,res)=>{
    try {

        const loggedUser=req.user
        const changedpassword=req.body.password

        if(!validator.isStrongPassword(changedpassword)){
            throw new Error('make your password stronger')
        }

        const newPasswordHashed=await bcrypt.hash(changedpassword,10)
        loggedUser.password=newPasswordHashed;

        console.log(loggedUser)

        await loggedUser.save()
        res.send('successfully changed your password')


        

    } catch (error) {
        res.status(500).json({message:'something went wrong on password'+error.message})
    }
})

module.exports=router;