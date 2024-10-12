import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

const BlogList = ({
  blogs,
  currentUserId,
  handleDeleteComment,
  setCommentingBlogId,
  commentingBlogId,
  newComment,
  setNewComment,
  handleCommentSubmit,
}) => {
  return (
    <div className="blog-cards-container" style={{ width: "100%" }}>
      {blogs.map((blog) => (
        <div
          key={blog._id}
          className="blog-card"
          style={{
            marginBottom: "20px",
            border: "1px solid #ccc",
            padding: "15px",
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            backgroundColor: "#fff",
            overflow: "hidden", // Prevents overflow
            wordWrap: "break-word", // Ensures long words wrap
            boxSizing: "border-box", // Includes padding in size calculation
          }}
        >
          <h2 style={{ margin: "0 0 10px", fontSize: "1.5em", color: "#333" }}>
            Title: {blog.title}
          </h2>
          <p
            style={{
              fontSize: "1em",
              color: "#555",
              maxWidth: "100%", // Prevents text from extending beyond the container
              overflowWrap: "break-word", // Ensures wrapping of long text
            }}
          >
            Content: {blog.content}
          </p>
          <p style={{ fontStyle: "italic", color: "#777" }}>
            <strong>Author:</strong> {blog?.author?.username}
          </p>

          <h4 style={{ margin: "10px 0", color: "#333" }}>Comments:</h4>
          <ul style={{ listStyleType: "none", padding: "0" }}>
            {blog.comments.map((comment) => (
              <li
                key={comment._id}
                style={{
                  marginBottom: "5px",
                  display: "flex",
                  alignItems: "center",
                  overflowWrap: "break-word", // Apply word wrapping to comments
                }}
              >
                <strong style={{ color: "#007BFF" }}>
                  {comment?.commentAuthor?.username}:
                </strong>
                <span style={{ color: "#555", marginLeft: "5px" }}>
                  {comment?.commentText}
                </span>

                {comment?.commentAuthor?._id === currentUserId && (
                  <button
                    onClick={() => handleDeleteComment(blog._id, comment._id)}
                    style={{
                      marginLeft: "10px",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "red",
                    }}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                )}
              </li>
            ))}
          </ul>

          <button
            onClick={() =>
              setCommentingBlogId(
                commentingBlogId === blog._id ? null : blog._id
              )
            }
            style={{
              padding: "10px 15px",
              marginTop: "10px",
              backgroundColor: "#007BFF",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              transition: "background-color 0.3s",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = "#0056b3")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = "#007BFF")
            }
          >
            {commentingBlogId === blog._id ? "Cancel Comment" : "Comment"}
          </button>

          {commentingBlogId === blog._id && (
            <div
              style={{
                marginTop: "10px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                style={{
                  padding: "10px",
                  width: "calc(100% - 22px)",
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                  marginBottom: "10px",
                  overflowWrap: "break-word", // Ensure input wraps correctly
                }}
              />
              <button
                onClick={() => handleCommentSubmit(blog._id)}
                style={{
                  padding: "10px 15px",
                  backgroundColor: "#28a745",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  transition: "background-color 0.3s",
                  width: "100%",
                  maxWidth: "200px",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.backgroundColor = "#218838")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.backgroundColor = "#28a745")
                }
              >
                Submit Comment
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default BlogList;
