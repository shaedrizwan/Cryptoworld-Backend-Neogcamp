const express = require('express')
const User = require('../models/user.model')
const router = express.Router()
const jwt = require("jsonwebtoken")
const bcrypt = require('bcryptjs')
const { checkUser, verifyAuth } = require('../middlewares/auth.middleware')

router.route('/')
    .get((req,res)=>{
        res.json({success:true,message:"User route"})
    })

router.route('/signup')
    .post(async(req,res)=>{
        try{
            const newUser = req.body
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(newUser.password,salt)
            newUser.password = hashedPassword
            const user = new User(newUser)
            const addUser = await user.save()
            res.json({success:true,addUser})
        }catch(err){
            res.json({success:false,message:err.message})
        }
    })

router.use("/login",checkUser)
router.route('/login')
    .post((req,res)=>{
        const user = req.user
        user.password = undefined
        const token = jwt.sign({userId:user._id},process.env.TOKEN_SECRET,{expiresIn:'24h'})
        res.json({success:true,token,user})
    })

router.use(verifyAuth)
router.route('/profile')
    .post(async(req,res)=>{
        const {username} = req.body
        const user = await User.findOne({username:username})
        if(user){
            user.password = undefined
            res.json({success:true,user})
        }else{
            res.status(404).json({success:false,message:"User not found"})
        }
    })

router.route('/updateName')
    .post(async(req,res)=>{
        try{
            const userId = req.userId
            const {newName} = req.body
            const user = await User.findOneAndUpdate({_id:userId},{name:newName})
            res.json({success:true,message:"Name successfully updated"})
        }catch(error){
            res.json(500).json({success:false,error:error.message})
        }
    })

router.route('/updateBio')
.post(async(req,res)=>{
    try{
        const userId = req.userId
        const {newBio} = req.body
        const user = await User.findOneAndUpdate({_id:userId},{bio:newBio})
        res.json({success:true,message:"Bio successfully updated"})
    }catch(error){
        res.json(500).json({success:false,error:error.message})
    }
})

router.route('/updateProfilePicture')
.post(async(req,res)=>{
    try{
        const userId = req.userId
        const {newProfilePicture} = req.body
        const user = await User.findOneAndUpdate({_id:userId},{profilePicture:newProfilePicture})
        res.json({success:true,message:"Profile picture successfully updated"})
    }catch(error){
        res.json(500).json({success:false,error:error.message})
    }
})

router.route('/updateCoverPicture')
.post(async(req,res)=>{
    try{
        const userId = req.userId
        const {newCoverPicture} = req.body
        const user = await User.findOneAndUpdate({_id:userId},{coverPicture:newCoverPicture})
        res.json({success:true,message:"Cover picture successfully updated"})
    }catch(error){
        res.json(500).json({success:false,error:error.message})
    }
})

router.route('/updateUsername')
    .post(async(req,res)=>{
        try{
            const userId = req.userId
            const {newUsername} = req.body
            const user = await User.findOneAndUpdate({_id:userId},{username:newUsername})
            res.json({success:true,message:"Username successfully updated"})
        }catch(error){
            res.status(500).json({success:false,error:error.message})
        }
    })

module.exports = router