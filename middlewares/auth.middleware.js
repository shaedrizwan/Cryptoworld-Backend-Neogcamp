const User = require("../models/user.model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const checkUser = async(req,res,next) =>{
    try{
        const {username,password} = req.body;
        const user = await User.findOne({username})
        if(!user){
            return res.status(404).json({success:false,message:"User not found"})
        }
        const isValidPassword = await bcrypt.compare(password,user.password);
        if(isValidPassword){
            req.user = user;
            return next();
        }
        if(!isValidPassword){
            return res.json({success:false,error:"Invalid Password"})
        }
    }
    catch(err){
        res.status(400).json({success:false,error:err.message,message:"Some Error occured"})
    }
}

const verifyAuth = (req,res,next) =>{
    const token = req.headers.authorization;
    try{
        const decoded = jwt.verify(token,process.env.TOKEN_SECRET);
        req.userId = decoded.userId;
        return next();
    } catch(err){
        return res.status(403).json({success:false,message:"Unauthorized access"})
    }
}


module.exports = {checkUser,verifyAuth};