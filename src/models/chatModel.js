const mongoose = require("mongoose");

    const messageSchema=mongoose.Schema({
        senderId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
            required:true
        },
        text:{
            type:String,
            required:true
        }
    },{timestamps:true})


const chatSchema = new mongoose.Schema({
  partcipants: [
    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  ],
  message:[messageSchema]
});

module.exports=mongoose.model('chats',chatSchema)