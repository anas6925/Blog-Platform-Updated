// Comment.js
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

const Comment = ({ comment, currentUserId, handleDeleteComment }) => {
  return (
    <li style={commentItemStyle}>
      <strong style={commentAuthorStyle}>
        {comment?.commentAuthor?.username}:
      </strong>
      <span style={commentTextStyle}>{comment?.commentText}</span>
      {comment?.commentAuthor?._id === currentUserId && (
        <button
          onClick={() => handleDeleteComment(comment.blogId, comment._id)}
          style={deleteButtonStyle}
        >
          <FontAwesomeIcon icon={faTrash} />
        </button>
      )}
    </li>
  );
};

// Define your styles here
const commentItemStyle = {
  marginBottom: "5px",
  display: "flex",
  alignItems: "center",
};
const commentAuthorStyle = {
  color: "#007BFF",
};
const commentTextStyle = {
  color: "#555",
  marginLeft: "5px",
};
const deleteButtonStyle = {
  marginLeft: "10px",
  background: "none",
  border: "none",
  cursor: "pointer",
  color: "red",
};

export default Comment;
