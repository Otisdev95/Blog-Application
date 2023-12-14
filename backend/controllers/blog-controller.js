import mongoose from "mongoose";
import BlogSchema from "../model/BlogSchema.js";
import UserSchema from "../model/UserSchema.js";

export const getAllBlogs = async (req, res, next) => {
    try {
        const blogs = await BlogSchema.find();
        if (!blogs || blogs.length === 0) {
            return res.status(404).json({ message: "No Blogs Found" });
        }
        return res.status(200).json({ blogs });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const getBlog = async (req, res, next) => {

    try {
        const getBlogId = req.params.id;
        const blog = await BlogSchema.findById(getBlogId);
        if (!blog) {
            return res.status(404).json({ message: "No Blog Found" });
        }
        return res.status(200).json({ blog });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const addBlog = async (req, res, next) => {
    const { title, description, image, user } = req.body;

    try {
        // ID of the user adding the blog
        const existingUser = await UserSchema.findById(user);
        if (!existingUser) {
            return res.status(404).json({ message: "Unable To Find User With This ID" });
        }
    
        const existingBlog = await BlogSchema.findOne({ title });

        // Checking for an existing blog
        if (existingBlog) {
            return res.status(400).json({ message: "This blog already exists" })
        }
        // Else creating a new blog
        const blog = new BlogSchema({ title, description, image, user });

        // Save the new blog but first, declare a session
        const session = await mongoose.startSession();

        // Define a Transaction
        session.startTransaction();

        try {
            // Saving the blog from the created session
            await blog.save({ session });
            // Pushing the blogs to the existing user array
            existingUser.blogs.push(blog);
            // Saving the existing user array
            await existingUser.save({ session });
            // Commiting the session Transaction
            await session.commitTransaction();

            return res.status(200).json({ message: "New blog saved successfully!" });

        } catch (error) {
            // If an Error occurs during Transction, Roll Back Changes
            await session.abortTransaction();
            throw error;
        } finally {
            // End the session
            session.endSession();
        }

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const updateBlog = async (req, res, next) => {
    const { title, description } = req.body;

    try {
        const blogId = req.params.id;
        const blog = await BlogSchema.findByIdAndUpdate(blogId, {
            title,
            description
        });

        // Checking if blog exists
        if (!blog) {
            return res.status(404).json({ message: "Blog not found" })
        }
        return res.status(200).json({ blog });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const deleteBlog = async (req, res, next) => {
    const { title } = req.body;

    try {
        const existingBlogId = req.params.id;
        const existingBlog = await BlogSchema.findByIdAndDelete(existingBlogId, { title }).populate("user");
        await existingBlog.user.blogs.pull(existingBlog);
        existingBlog.user.save();

        // Checking if blog exists
        if (!existingBlog) {
            return res.status(400).json({ message: "Blog title does not exist!" });
        }
        return res.status(200).json({ message: "Blog Deleted Successfully" });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const getByUserId = async (req, res, next) => {
    const userId = req.params.id;

    try {
        const userBlogs = await UserSchema.findById(userId).populate("blogs");

        if (!userBlogs) {
            return res.status(404).json({ message: "No Blog Found" });
        }

        return res.status(200).json({ blogs:userBlogs });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error" })
    }
}