import BlogSchema from "../model/BlogSchema.js";

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
        const existingBlog = await BlogSchema.findOne({ title });

        // Checking for an exiting blog
        if (existingBlog) {
            return res.status(400).json({ message: "This blog already exists" })
        }
        // Else creating a new blog
        const blog = new BlogSchema({ title, description, image, user });

        // Save the new blog
        await blog.save();
        return res.status(200).json({ message: "New blog saved successfully!" });

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
        const existingBlog = await BlogSchema.findByIdAndDelete(existingBlogId, { title });

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