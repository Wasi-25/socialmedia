const { urlencoded } = require("express");
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");

dotenv.config({
    path: "./config/config.env",
})


if(process.env.NODE_ENV!=="production"){
    require("dotenv").config({path: "backend/config/config.env"});
}

// using Middlewares
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true}));
app.use(cookieParser());

//importing routes
const post = require("./routes/post");
const user = require("./routes/user");

// using routes
app.use("/api/v1",post);
app.use("/api/v1",user);

app.get("/",(req,res)=>{
    res.send("working");
});


module.exports = app;
