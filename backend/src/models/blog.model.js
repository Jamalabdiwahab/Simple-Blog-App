import mongoose from "mongoose";


const blogSchema = new mongoose.Schema({
    user:{
        type: mongoose.Types.ObjectId,
        ref:"User",
        required:true
    },
    title:{
        type: String,
        required: true
    },
    content:{
        type: String,
        required: true
    },
    image:{
        type: String,
        default:""
    },
    video:{
        type: String,
        default:""
    }
}, {timestamps:true})

const Blog = mongoose.model("Blog", blogSchema);
export default Blog;