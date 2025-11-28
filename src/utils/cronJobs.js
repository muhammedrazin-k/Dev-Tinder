const { subDays, startOfDay, endOfDay } = require('date-fns')
const cron=require('node-cron')
const connectionRequestModel = require('../models/connectionRequestModel')
const { sendEmail } = require('./sendEmail')


cron.schedule('19 19 * * *',async()=>{
    try {
        const yesterday=subDays(new Date(),1)
        console.log(yesterday)

        const yesterdayStart=startOfDay(yesterday)
        const yesterdayEnd=endOfDay(yesterday)

        const pendingRequest=await connectionRequestModel.find({
            status:"interested",
            createdAt:{
                $gte:yesterdayStart,
                $lt: yesterdayEnd
            }
        }).populate('fromUserId toUserId')

        console.log(pendingRequest,"its pending")

        const listofEmails=[...new Set(pendingRequest.map((req)=>req.toUserId.EmailId))]
        console.log(listofEmails)

        for(const email of listofEmails){
            try {
                const res=await sendEmail('mail@devzin.xyz','m.razin600@gmail.com', 'welcome mr. this was cron job from email',`new friend request is pending for ${email} please login and check it `)
                console.log(res)
            } catch (error) {
                console.log(error.message)
                
            }
        }

    } catch (error) {
        console.log(error.message)
        
    }
})