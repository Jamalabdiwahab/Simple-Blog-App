import Blog from "../models/blog.model.js";
import ImageKit from "imagekit";

const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

export async function getAllBlogs(req,res) {

    try {
        const loggedInUser = req.user.id;
        const blogs = await Blog.find({user:loggedInUser})
            .populate("user", "name email profilePic")
            .sort({createdAt: -1 });

        res.status(200).json(blogs);
    } catch (error) {
        console.error("error getting blogs: ",error);
        res.status(500).json({message:"internal server error"})
    }
}

export async function getBlogById(req,res) {

    try {
        const { id } = req.params;
        const blog = await Blog.findById(id).populate("user", "name email profilePic");

        if(!blog){
            return res.status(404).json({message:"This blog not found."})
        }

        res.status(200).json(blog);
    } catch (error) {
        console.error("error getting blog by id: ",error);
        res.status(500).json({message:"internal server error"})
    }
}

export async function addBlog(req,res) {

    let { title, content, image, video} = req.body;
    const loggedInUser = req.user.id;

    if(!title || !content){
        return res.status(400).json({message:"please fill all the fields"})
    }

    try {

        const blog = await Blog.create({title,content,image,video,user:loggedInUser});

        res.status(201).json({
            message:'Todo added successfully!',
            blog
        });
    } catch (error) {
        console.error("error adding blog: ",error);
        res.status(500).json({message:"internal server error"})
    }
}
export async function updateBlog(req,res) {
    const { id } = req.params;
    const { title, content, image, video} = req.body;

    try {

        const updatedBlog = await Blog.findByIdAndUpdate(id,{title,content,image,video},{new:true});
        
        if(!updatedBlog){
            return res.status(404).json({message:"This blog not found."})
        }
        res.status(200).json({
            message:'Blog updated successfully!',
            blog: updatedBlog
        });
    } catch (error) {
        console.error("error updating blog: ",error);
        res.status(500).json({message:"internal server error"})
    }
}

export async function deleteBlog(req,res) {
    const { id } = req.params;

    try {

        const deletedBlog = await Blog.findByIdAndDelete(id);
        
        if(!deletedBlog){
            return res.status(404).json({message:"This blog not found."})
        }
        res.status(200).json({
            message:'Blog deleted successfully!',
        });
    } catch (error) {
        console.error("error deleting blog: ",error);
        res.status(500).json({message:"internal server error"})
    }
}

export async function uploadBlogMedia(req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file provided." });
        }

        const isVideo = req.file.mimetype.startsWith("video/");

        const uploadRes = await imagekit.upload({
            file: req.file.buffer,
            fileName: `blog_${Date.now()}`,
            folder: isVideo ? "/blog-videos" : "/blog-images",
            useUniqueFileName: true,
        });

        res.status(200).json({
            url: uploadRes.url,
            fileId: uploadRes.fileId,
        });
    } catch (error) {
        console.error("error uploading blog media: ", error);
        res.status(500).json({ message: "internal server error" });
    }
}