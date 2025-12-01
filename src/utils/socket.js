const  Socket  = require("socket.io")
const crypto=require('crypto')
const chatModel = require("../models/chatModel")

const generateSecretRoomId=(storeUser,id)=>{
 return crypto.createHash('sha256').update([storeUser,id].sort().join("_")).digest('hex')
}

const initializeSocket=(server)=>{
    const io=Socket(server,{
        cors:{
         origin:'http://localhost:5173'
        }
      })

      io.on('connection',(socket)=>{
        socket.on("joinChat",({firstName,storeUser,id})=>{
          const room=generateSecretRoomId(storeUser,id)
          socket.join(room)
          
          console.log(firstName +"   "+room)
        })
        socket.on("sendMessage",async({firstName,lastName,storeUser,id,text})=>{
          
          try {
            const room=generateSecretRoomId(storeUser,id)
            let chat=await chatModel.findOne({partcipants:{$all:[storeUser,id]}})

            if(!chat){
              chat=new chatModel({
                partcipants:[storeUser,id],
                message:[]
              })
            }

            chat.message.push({
              senderId:storeUser,
              text:text
            })

            await chat.save()
            io.to(room).emit("messageRecieved",{firstName,lastName,text})
            
          } catch (err) {
            console.log(err)
          }
        })
        socket.on('disconnect',()=>{
            
        })
      })
      
}

module.exports=initializeSocket