const mongoose=require('mongoose')
require('dotenv').config()

const connectdb=async ()=>{
    try{ 
       await mongoose.connect(process.env.mongo_url)
       return true
    }catch(err){
        console.error('mongo connection is failed due to ',err.message)
        throw err;

        }
}

module.exports=connectdb; 