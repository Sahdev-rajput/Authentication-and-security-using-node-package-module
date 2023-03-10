//jshint esversion:6
require("dotenv").config();
const express=require("express");
const app=express();
const bodyParser=require("body-parser");
const mongoose=require("mongoose");
const encrypt=require("mongoose-encryption");

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set('view engine','ejs');
mongoose.connect("mongodb://127.0.0.1:27017/userDataDB")




const userSchema=new mongoose.Schema({
    Email: String,
    password: String
})
const User=mongoose.model("User",userSchema);
const secrets=process.env.SECRETS;
userSchema.plugin(encrypt,{secret: secrets,encryptedFields:["password"]});


app.get("/",function(req,res)
{
    res.render("home");
})

app.get("/register",function(req,res)
{
    res.render("register");
})

app.get("/login",function(req,res)
{
    res.render("login");
})
app.post("/register",function(req,res)
{
    const newData=new User({
        Email: req.body.username,
        password: req.body.password
    })    
    newData.save();
    res.render("secrets");
})
app.post("/login",function(req,res)
{
    const username=req.body.username;
    const password=req.body.password;
    User.findOne({Email: username}).then(results=>{
            if(results.password===password)
            {
                res.render("secrets");
            }
            else
            {
                console.log("Result not found");
            }
    });
})












app.listen(3000,function()
{
    console.log("the server is running at the port 3000");
})
