import express from "express";
import { getAllBlogs, getBlog, addBlog, deleteBlog, updateBlog } from "../controllers/blog-controller.js";

const blogRouter = express.Router()

blogRouter.get('/', getAllBlogs)

blogRouter.get('/:id', getBlog)

blogRouter.post('/add', addBlog)

blogRouter.put('/update/:id', updateBlog)

blogRouter.delete('/delete/:id', deleteBlog);

export default blogRouter;