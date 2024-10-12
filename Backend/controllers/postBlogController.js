import mongoose from "mongoose";
import PostBlogModel from "../models/postBlogModel.js";
import Joi from "joi";

// Validation schema using Joi
const blogSchema = Joi.object({
  title: Joi.string().required().min(3).max(100).messages({
    "string.empty": "Title is required",
    "string.min": "Title must be at least 3 characters long",
    "string.max": "Title must be less than 100 characters long",
  }),
  content: Joi.string().required().min(10).messages({
    "string.empty": "Content is required",
    "string.min": "Content must be at least 10 characters long",
  }),
});

// Create a new post
export const createBlog = async (req, res) => {
  const { error } = blogSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      status: "Failure",
      message: error.details[0].message,
      code: 400,
    });
  }

  const { title, content } = req.body;
  try {
    const newPost = new PostBlogModel({
      title,
      content,
      author: req.user._id,
    });

    const savedBlog = await newPost.save();
    if (savedBlog) {
      return res.status(201).json({
        status: "Success",
        message: "Blog Created Successfully",
        code: 201,
        data: [],
      });
    }
  } catch (error) {
    console.error("Error creating blog:", error);
    res.status(500).json({ error: "Error Creating Blog" });
  }
};

// Get all posts against the user
export const getBlogsAgainstUser = async (req, res) => {
  try {
    const authorId = req.user._id;
    const posts = await PostBlogModel.find({ author: authorId }).populate(
      "author",
      "username email"
    );

    if (posts.length === 0) {
      return res.status(404).json({
        status: "Failure",
        message: "No Blogs Found for This User",
        code: 404,
        data: [],
      });
    } else {
      return res.status(200).json({
        status: "Success",
        message: "Blogs Found Successfully",
        code: 200,
        data: { posts },
      });
    }
  } catch (error) {
    console.error("Error fetching user blogs:", error);
    res.status(500).json({ error: "Error fetching posts" });
  }
};

// Get a single post by ID
export const getOneBlog = async (req, res) => {
  const { id } = req.params;

  try {
    const getSingleBlog = await PostBlogModel.findById(id).populate(
      "author",
      "username email"
    );

    if (!getSingleBlog) {
      return res.status(404).json({
        status: "Failure",
        message: "Blog Not Found",
        code: 404,
      });
    } else {
      return res.status(200).json({
        status: "Success",
        message: "Blog Found Successfully",
        code: 200,
        data: { getSingleBlog },
      });
    }
  } catch (error) {
    console.error("Error fetching blog:", error);
    res.status(500).json({ error: "Error fetching post" });
  }
};

// Update a post by ID
export const updateBlog = async (req, res) => {
  const { id } = req.params;
  const { error } = blogSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      status: "Failure",
      message: error.details[0].message,
      code: 400,
    });
  }

  const { title, content } = req.body;

  try {
    const post = await PostBlogModel.findById(id);

    if (!post) {
      return res.status(404).json({
        status: "Failure",
        message: "Blog Not Found",
        code: 404,
      });
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    // Update post details
    post.title = title || post.title;
    post.content = content || post.content;
    post.updatedAt = Date.now();

    const updatedBlog = await post.save();
    if (updatedBlog) {
      return res.status(200).json({
        status: "Success",
        message: "Blog Updated Successfully",
        code: 200,
        data: [],
      });
    }
  } catch (error) {
    console.error("Error updating blog:", error);
    res.status(500).json({ error: "Error updating post" });
  }
};

// Delete a post by ID
export const deleteBlog = async (req, res) => {
  const { id } = req.params;

  try {
    const post = await PostBlogModel.findById(id);

    if (!post) {
      return res.status(404).json({
        status: "Failure",
        message: "Blog Not Found",
        code: 404,
      });
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const dleteBlog = await PostBlogModel.deleteOne({ _id: id });
    if (dleteBlog) {
      return res.status(200).json({
        status: "Success",
        message: "Blog Deleted Successfully",
        code: 200,
      });
    }
  } catch (error) {
    console.error("Error deleting blog:", error);
    res.status(500).json({ error: "Error Deleting Post" });
  }
};

// Get all blogs (independent of author)
export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await PostBlogModel.find()
      .populate("author", "username email")
      .populate({
        path: "comments.commentAuthor",
        select: "username email",
      });

    if (blogs.length === 0) {
      return res.status(404).json({
        status: "Failure",
        message: "No Blogs Found",
        code: 404,
        data: [],
      });
    } else {
      return res.status(200).json({
        status: "Success",
        message: "Blogs Retrieved Successfully",
        code: 200,
        data: { blogs },
      });
    }
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(500).json({ error: "Error fetching blogs" });
  }
};

// Add Comments For Blog
export const addComment = async (req, res) => {
  const { blogId } = req.params;
  const { content } = req.body;

  if (!content || content.trim().length === 0) {
    return res.status(400).json({
      status: "Failure",
      message: "Comment content is required",
      code: 400,
    });
  }

  const userId = req.user._id;

  try {
    const blogPost = await PostBlogModel.findById(blogId);
    if (!blogPost) {
      return res.status(404).json({
        status: "Failure",
        message: "Blog Post Not Found",
        code: 404,
      });
    }

    const newComment = {
      commentText: content,
      commentAuthor: userId,
      createdAt: new Date(),
    };
    blogPost.comments.push(newComment);
    const saveUserComment = await blogPost.save();
    if (saveUserComment) {
      return res.status(201).json({
        status: "Success",
        message: "Comment added successfully",
        code: 201,
      });
    }
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete Comments For Blog
export const deleteComment = async (req, res) => {
  const { blogId, commentId } = req.params;
  const userId = req.user._id;

  try {
    const blogPost = await PostBlogModel.findById(blogId);

    if (!blogPost) {
      return res.status(404).json({
        status: "Failure",
        message: "Blog Post Not Found",
        code: 404,
      });
    }

    const comment = blogPost.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({
        status: "Failure",
        message: "Comment Not Found",
        code: 404,
      });
    }

    if (comment.commentAuthor.toString() !== userId.toString()) {
      return res.status(403).json({
        status: "Failure",
        message: "You are not authorized to delete this comment",
        code: 403,
      });
    }

    blogPost.comments.pull(commentId);
    const deleteUserComment = await blogPost.save();
    if (deleteUserComment) {
      return res.status(200).json({
        status: "Success",
        message: "Comment deleted successfully",
        code: 200,
      });
    }
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ message: "Server error" });
  }
};
