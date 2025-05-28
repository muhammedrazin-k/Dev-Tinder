const validator=require("validator")

const validation=(req)=>{
    const {firstName,lastName,EmailId,password}=req.body

    if(!firstName || !lastName){
        throw new Error(' enter your first name and last Name')
    }
    else if(!validator.isEmail(EmailId)){
        throw new Error(" invalid Email id")
    }
    else if(!validator.isStrongPassword(password)){

        throw new Error(" please enter a strong password")
    }
}

const validateProfileData=(req)=>{
    const allowedEdit=["firstName","lastName","age","gender","about","photoUrl"]

    const isEditAllowed=Object.keys(req.body).every(fields=>allowedEdit.includes(fields))
    return isEditAllowed;
}

module.exports={validation ,validateProfileData}