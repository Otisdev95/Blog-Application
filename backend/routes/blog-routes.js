import express from "express";
import { getAllBlogs, getBlog, addBlog, deleteBlog, updateBlog, getByUserId } from "../controllers/blog-controller.js";

const blogRouter = express.Router()

blogRouter.get('/', getAllBlogs)

blogRouter.get('/:id', getBlog)

blogRouter.post('/add', addBlog)

blogRouter.put('/update/:id', updateBlog)

blogRouter.delete('/delete/:id', deleteBlog)

blogRouter.get('/user/:id', getByUserId)

export default blogRouter;