const express = require("express");
const connectDB = require("./config/database.js");
const cookieparser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const cors=require('cors')


const app = express();

app.use(cors({
  origin:'http://localhost:5173',
  credentials:true
}))
app.use(express.json());
app.use(cookieparser());

const authRouter=require('./routes/authRouter.js')
const profileRouter=require('./routes/profileRouter.js')
const requestRouter=require('./routes/requestRouter.js')
const userRouter=require('./routes/userRouter.js')

app.use('/' ,authRouter)
app.use('/',profileRouter)
app.use('/',requestRouter)
app.use('/',userRouter)








connectDB()
  .then(() => {
    console.log("database connected successfully");

    app.listen(3000, () => {
      console.log("port is listening on 3000");
    });
  })
  .catch((err) => {
    console.error("something went wrong", err.message);
  });
