import mongoose from "mongoose";


const blogSchema = new mongoose.Schema({
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
    }
}, {timestamps:true})

const Blog = mongoose.model("Todos", blogSchema);
export default Blog;