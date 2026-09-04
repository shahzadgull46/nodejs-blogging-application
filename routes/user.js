
const express = require("express")

const userRouter = express.Router()

const {handleSignUp, handleSingIn} = require("../controllers/user")


userRouter.get("/signin",(req,res)=>{
    res.render("signin")
})
userRouter.post("/signin",handleSingIn)

userRouter.get("/signup",(req,res)=>{
res.render("signup")
})
userRouter.post("/signup", handleSignUp);

module.exports={
 userRouter,   
}