const express = require('express')
const User = require('../models/user.model')
const router = express.Router()
const jwt = require("jsonwebtoken")
const bcrypt = require('bcryptjs')
const { checkUser } = require('../middlewares/auth.middleware')

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

router.use(checkUser)
router.route('/login')
    .post((req,res)=>{
        const user = req.user
        user.password = undefined
        const token = jwt.sign({userId:user._id},process.env.TOKEN_SECRET,{expiresIn:'24h'})
        res.json({success:true,token,user})
    })

module.exports = router