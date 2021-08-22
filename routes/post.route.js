const express = require('express')
const { verifyAuth } = require('../middlewares/auth.middleware')
const Post = require('../models/post.model')
const router = express.Router()
const User = require('../models/user.model')

router.route('/')
    .get(async(req,res)=>{
        try{
            const posts = await Post.find({}).sort('-createdAt').populate('user')
            res.json({success:true,posts})
        }catch(err){
            res.json({success:false,error:err.message})
        }
    })

router.use(verifyAuth)
router.route('/add')
    .post(async(req,res)=>{
        try{
            const {post} = req.body
            const userId = req.userId
            const user = await User.findById(userId)
            const name = `${user.firstName} ${user.lastName}`
            const newPost = {
                post:post,
                name:name,
                username:user.username,
                profilePicture:user.profilePicture
            }
            const addPost = new Post(newPost)
            const addedPost = await addPost.save()
            res.json({success:true,addedPost})
        }catch(err){
            res.json({success:false,error:err.message})
        }
    })

router.route('/likePost')
    .post(async(req,res)=>{
        try{
            const userId = req.userId
            const {postId} = req.body
            const post = await Post.findById(postId)
            const isLiked = post.likes.find(id => String(id) === userId)
            if(isLiked){
                post.likes.pop(userId)
                const updatedLikes = await post.save()
                res.json({success:true,message:"Unliked successfully",updatedLikes})
            }else{
                post.likes.push(userId)
                const updatedLikes = await post.save()
                res.json({success:true,message:"Liked successfully",updatedLikes})
            }
        }catch(err){
            res.josn({success:false,error:err.message})
        }
    })


module.exports = router