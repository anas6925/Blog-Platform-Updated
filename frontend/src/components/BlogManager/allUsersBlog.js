import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import url from "../../config/serverUrl";
import { useNavigate } from "react-router-dom";
import NavigationBar from "../NavigationBar/NavigationBar";
import BlogList from "./allBlogsList";
import { isTokenExpired } from "../../authUtils";
const AllUsersBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [commentingBlogId, setCommentingBlogId] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    fetchBlogs();
  }, []);
  const navigate = useNavigate();

  const getCurrentUserId = () => {
    const token = localStorage.getItem("token");
    if (!token || isTokenExpired(token)) {
      navigate("/login");
      return;
    }

    const tokenParts = token.split(".");
    if (tokenParts.length !== 3) {
      console.error("Invalid token format");
      return null;
    }

    const payload = atob(tokenParts[1]);
    const parsedPayload = JSON.parse(payload);
    const userId = parsedPayload.id;
    return userId;
  };

  useEffect(() => {
    const userId = getCurrentUserId();
    setCurrentUserId(userId);
  }, []);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${url}getAllBlogs`);
      setBlogs(response.data.data.blogs);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCommentSubmit = async (blogId) => {
    if (!newComment) return;
    try {
      const token = localStorage.getItem("token");

      if (!token || isTokenExpired(token)) {
        navigate("/login");
        return;
      }
      const headers = { Authorization: `Bearer ${token}` };

      const submitComment = await axios.post(
        `${url}addComment/${blogId}`,
        { content: newComment },
        { headers }
      );
      if (submitComment.data.status === "Success") {
        toast.success(submitComment.data.message);
        setNewComment("");
        fetchBlogs();
        setCommentingBlogId(null);
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleDeleteComment = async (blogId, commentId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token || isTokenExpired(token)) {
        navigate("/login");
        return;
      }
      const headers = { Authorization: `Bearer ${token}` };

      const response = await axios.delete(
        `${url}deleteComment/${blogId}/${commentId}`,
        { headers }
      );
      if (response.data.status === "Success") {
        toast.success(response.data.message);
        fetchBlogs();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error("Failed to delete comment");
    }
  };

  return (
    <>
      <NavigationBar />
      <div
        className="blog-manager mt-5"
        style={{ width: "100%", padding: "20px" }}
      >
        <h1 style={{ textAlign: "center", marginBottom: "30px" }}>
          Blog Manager
        </h1>

        {loading ? (
          <p className="loading-indicator" style={{ textAlign: "center" }}>
            Loading blogs...
          </p>
        ) : blogs.length === 0 ? (
          <p style={{ textAlign: "center", color: "#777" }}>No blogs found.</p>
        ) : (
          <BlogList
            blogs={blogs}
            currentUserId={currentUserId}
            handleDeleteComment={handleDeleteComment}
            setCommentingBlogId={setCommentingBlogId}
            commentingBlogId={commentingBlogId}
            newComment={newComment}
            setNewComment={setNewComment}
            handleCommentSubmit={handleCommentSubmit}
          />
        )}
      </div>
    </>
  );
};

export default AllUsersBlogs;
