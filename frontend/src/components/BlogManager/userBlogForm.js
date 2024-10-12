// BlogForm.js
import React from "react";

const UserBlogForm = ({
  formFields,
  setFormFields,
  handleSubmit,
  isEditing,
}) => {
  return (
    <div className="blog-form">
      <input
        type="text"
        placeholder="Title"
        value={formFields.title}
        onChange={(e) =>
          setFormFields({ ...formFields, title: e.target.value })
        }
      />
      <textarea
        placeholder="Content"
        value={formFields.content}
        onChange={(e) =>
          setFormFields({ ...formFields, content: e.target.value })
        }
      />
      <button onClick={handleSubmit}>
        {isEditing ? "Update Blog" : "Create Blog"}
      </button>
    </div>
  );
};

export default UserBlogForm;
