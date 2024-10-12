// BlogList.js
import React from "react";
import BlogCard from "./blogCard";

const UserBlogList = ({
  blogs = [],
  loading,
  handleEditBlog,
  handleDeleteBlog,
}) => {
  // Set default value for blogs
  return (
    <div className="container">
      {loading ? (
        <p className="loading-indicator">Loading blogs...</p>
      ) : (
        <div className="row">
          {blogs.map((blog) => (
            <div key={blog._id} className="col-md-6 mb-4">
              <BlogCard
                title={blog.title}
                content={blog.content}
                author={blog.author}
                onEdit={() => handleEditBlog(blog)}
                onDelete={() => handleDeleteBlog(blog._id)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserBlogList;
