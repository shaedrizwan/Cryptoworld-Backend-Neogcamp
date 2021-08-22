const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    firstName:{
        type:String,
        required:["First name required"]
    },
    lastName:{
        type:String
    },
    email:{
        type:String,
        required:["Email required"]
    },
    username:{
        type:String,
        required:["Username required"],
        unique:["Username already exists"]
    },
    password:{
        type:String,
        required:["Password required"]
    },
    bio:{
        type:String
    },
    profilePicture:{
        type:String
    },
    coverPicture:{
        type:String
    }
})

module.exports = mongoose.model('User',userSchema)