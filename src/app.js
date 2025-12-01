const express = require("express");
const connectDB = require("./config/database.js");
const cookieparser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const http=require('http')
const cors=require('cors')
require('dotenv').config()


const app = express();

require('./utils/cronJobs.js')
app.use(cors({
  origin:'http://localhost:5173',
  credentials:true
}))
app.use(express.json());
app.use(cookieparser());

const initializeSocket = require("./utils/socket.js");

const authRouter=require('./routes/authRouter.js')
const profileRouter=require('./routes/profileRouter.js')
const requestRouter=require('./routes/requestRouter.js')
const userRouter=require('./routes/userRouter.js')
const paymentRouter=require('./routes/paymentRouter.js');
const chatRouter=require('./routes/chatRouter.js')

app.use('/' ,authRouter)
app.use('/',profileRouter)
app.use('/',requestRouter)
app.use('/',userRouter)
app.use('/',paymentRouter)
app.use('/',chatRouter)



const server=http.createServer(app)

initializeSocket(server)



connectDB()
  .then(() => {
    console.log("database connected successfully");

    server.listen(3000, () => {
      console.log("port is listening on 3000");
    });
  })
  .catch((err) => {
    console.error("something went wrong", err.message);
  });
