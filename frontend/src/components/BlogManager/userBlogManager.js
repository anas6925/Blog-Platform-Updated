import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchBlogs,
  createBlog,
  resetMessage,
  editBlog,
  deleteBlog,
} from "../../redux/blogSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import NavigationBar from "../NavigationBar/NavigationBar";
import BlogForm from "./userBlogForm"; // Import the BlogForm component
import BlogList from "./userBlogList"; // Import the BlogList component
import "./BlogManager.css";

const UserBlogManager = ({ setIsAuthenticated }) => {
  const initialFormFields = { title: "", content: "" };
  const dispatch = useDispatch();
  const { blogs, loading, error, message } = useSelector(
    (state) => state.blogs
  );

  const [formFields, setFormFields] = useState(initialFormFields);
  const [isEditing, setIsEditing] = useState(false);
  const [currentBlogId, setCurrentBlogId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (message) {
      toast.success(message);
      dispatch(resetMessage());
    }
  }, [message, dispatch]);

  useEffect(() => {
    dispatch(fetchBlogs(navigate));
  }, [dispatch, navigate]);

  const validateForm = () => {
    if (formFields.title === "" && formFields.content === "") {
      toast.error("Please Fill All The Fields");
      return false; // Return false for validation failure
    }
    if (formFields.title === "") {
      toast.error("Please Enter The Title");
      return false; // Return false for validation failure
    }
    if (formFields.title.length < 3 || formFields.title.length > 100) {
      toast.error("Title Must Be Between 3 To 100 Characters Long");
      return false; // Return false for validation failure
    }
    if (formFields.content === "") {
      toast.error("Please Enter The Content");
      return false; // Return false for validation failure
    }
    if (formFields.content.length < 10) {
      toast.error("Content Must Be At Least 10 Characters Long");
      return false; // Return false for validation failure
    }
    return true; // Return true for validation success
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const action = isEditing
        ? editBlog({ id: currentBlogId, updatedBlog: formFields, navigate })
        : createBlog({ formFields, navigate });

      dispatch(action).then(() => {
        dispatch(fetchBlogs(navigate));
      });

      if (!isEditing) {
        setFormFields(initialFormFields);
      } else {
        setIsEditing(false);
        setCurrentBlogId(null);
        setFormFields(initialFormFields);
      }
    }
  };

  const handleEditBlog = (blog) => {
    setIsEditing(true);
    setFormFields({
      title: blog.title,
      content: blog.content,
    });
    setCurrentBlogId(blog._id);
  };

  const handleDeleteBlog = (id) => {
    dispatch(deleteBlog({ id, navigate })).then(() => {
      dispatch(fetchBlogs(navigate));
    });
  };

  return (
    <>
      <NavigationBar />
      <div className="blog-manager mt-5">
        <h1>Blog Manager</h1>
        <BlogForm
          formFields={formFields}
          setFormFields={setFormFields}
          handleSubmit={handleSubmit}
          isEditing={isEditing}
        />
      </div>
      <BlogList
        blogs={blogs}
        loading={loading}
        handleEditBlog={handleEditBlog}
        handleDeleteBlog={handleDeleteBlog}
      />
    </>
  );
};

export default UserBlogManager;
