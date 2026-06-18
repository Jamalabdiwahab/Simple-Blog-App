import Blog from "../models/blog.model.js";



export async function getAllBlogs(req,res) {

    try {
        const loggedInUser = req.user.id;
        const blogs = await Blog.find({_id:loggedInUser}).sort({createdAt: -1 });

        res.status(200).json(blogs);
    } catch (error) {
        console.error("error getting blogs: ",error);
        res.status(500).json({message:"internal server error"})
    }
}

export async function getBlogById(req,res) {

    try {
        const { id } = req.params;
        const blog = await Blog.find(id);

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

    let { title, content, image} = req.body;

    if(!title || !content){
        return res.status(400).json({message:"please fill all the fields"})
    }

    try {

        const blog = await Blog.create({title,content,image});

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
    const { title, content, image} = req.body;

    try {

        const updatedBlog = await Todos.findByIdAndUpdate(id,{title,content,image},{new:true});
        
        if(!updateBlog){
            return res.status(404).json({message:"This blog not found."})
        }
        res.status(200).json({
            message:'Blog updated successfully!',
            updateBlog
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