import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import upload from "../lib/multer.js";
import { addBlog, deleteBlog, getAllBlogs, getBlogById, updateBlog, uploadBlogMedia } from "../controllers/blog.controller.js";

const router = Router();

router.use(verifyToken)

router.get("/",getAllBlogs)
router.post("/add",addBlog)
router.post("/upload-media", upload.single("media"), uploadBlogMedia);
router.get("/:id",getBlogById);
router.put("/:id",updateBlog)
router.delete("/:id",deleteBlog)
export default router;