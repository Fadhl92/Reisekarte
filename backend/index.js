const express=require("express")
const mongoose=require("mongoose")
const app=express();
const dotenv=require("dotenv");
const pinRoute=require("./routes/pins");
const userRoute=require("./routes/users");
const CryptoJS = require("crypto-js");

dotenv.config();

app.use(express.json());

mongoose.connect(process.env.MONGO_URL).then(()=>{
   console.log("MongoDB connected!")

}).catch((err)=> console.log(err));

app.use("/api/pins", pinRoute)
app.use("/api/users", userRoute)
app.listen(8080, ()=>{
    console.log("Backend server is running!")

})

 
