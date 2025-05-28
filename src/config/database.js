const mongoose=require('mongoose')
require('dotenv').config()

const connectdb=async ()=>{
    try{ 
       await mongoose.connect(process.env.mongo_url)
    }catch(err){
        console.error('mongo connection is failed',err.message)
        }
}

module.exports=connectdb; 