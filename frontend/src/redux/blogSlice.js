import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import url from "../config/serverUrl";
import { toast } from "react-toastify";
import { isTokenExpired } from "../authUtils";
const initialState = {
  blogs: [],
  loading: false,
  error: null,
  message: null,
};

// Thunks
export const fetchBlogs = createAsyncThunk(
  "blogs/fetchBlogs",
  async (navigate, { rejectWithValue }) => {
    const token = localStorage.getItem("token");
    if (!token || isTokenExpired(token)) {
      navigate("/login");
      return rejectWithValue("User not authenticated.");
    }

    try {
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get(`${url}getBlogsAgainstUser`, {
        headers,
      });

      return response.data.data.posts || [];
    } catch (error) {
      return rejectWithValue("Error fetching blogs.");
    }
  }
);

export const createBlog = createAsyncThunk(
  "blogs/createBlog",
  async ({ formFields, navigate }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token || isTokenExpired(token)) {
        navigate("/login");
        return rejectWithValue("User not authenticated.");
      }
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };
      const response = await axios.post(`${url}createBlog`, formFields, {
        headers,
      });

      if (response.data.status === "Success") {
        toast.success(response.data.message);
        return response.data.message;
      } else {
        return rejectWithValue(response.data.message);
      }
    } catch (error) {
      return rejectWithValue("Error creating blog.");
    }
  }
);

export const editBlog = createAsyncThunk(
  "blogs/editBlog",
  async ({ id, updatedBlog, navigate }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token || isTokenExpired(token)) {
        navigate("/login");
        return rejectWithValue("User not authenticated.");
      }
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };
      const response = await axios.put(`${url}updateBlog/${id}`, updatedBlog, {
        headers,
      });

      if (response.data.status === "Success") {
        toast.success(response.data.message);
        return { id, updatedBlog };
      } else {
        return rejectWithValue(response.data.message);
      }
    } catch (error) {
      return rejectWithValue("Error editing blog.");
    }
  }
);

export const deleteBlog = createAsyncThunk(
  "blogs/deleteBlog",
  async ({ id, navigate }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      if (!token || isTokenExpired(token)) {
        navigate("/login");
        return rejectWithValue("User not authenticated.");
      }
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.delete(`${url}deleteBlog/${id}`, {
        headers,
      });

      if (response.data.status === "Success") {
        toast.success(response.data.message);
        return id;
      } else {
        return rejectWithValue(response.data.message);
      }
    } catch (error) {
      return rejectWithValue("Error deleting blog.");
    }
  }
);

// Slice
export const blogSlice = createSlice({
  name: "blogs",
  initialState,
  reducers: {
    resetMessage: (state) => {
      state.message = null;
    },
    clearBlogs: (state) => {
      state.blogs = []; // Clear the blogs
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.loading = false;
        state.blogs = action.payload;
      })
      .addCase(fetchBlogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createBlog.fulfilled, (state, action) => {
        state.message = action.payload;
      })
      .addCase(createBlog.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(editBlog.fulfilled, (state, action) => {
        const { id, updatedBlog } = action.payload;
        const index = state.blogs.findIndex((blog) => blog._id === id);
        if (index !== -1) {
          state.blogs[index] = { ...state.blogs[index], ...updatedBlog };
        }
      })
      .addCase(editBlog.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(deleteBlog.fulfilled, (state, action) => {
        const id = action.payload;
        state.blogs = state.blogs.filter((blog) => blog._id !== id); // Remove the deleted blog
      })
      .addCase(deleteBlog.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

// Actions and reducer export
export const { resetMessage, clearBlogs } = blogSlice.actions;
export default blogSlice.reducer;
