
const mongoose = require("mongoose")

const userComments = new mongoose.Schema({
    content:{
        type:String,
        required:true,
    },
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
    blogId:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "blog"
    },
},{timestamps:true})

const comments = mongoose.model("comments",userComments)
module.exports = comments