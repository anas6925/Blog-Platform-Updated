import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux"; // Import Provider from react-redux
import { store } from "./redux/store"; // Import the store
import Signup from "./components/LoginSignUp/Signup";
import Login from "./components/LoginSignUp/Login";
import BlogManager from "./components/BlogManager/userBlogManager";
import AllUsersBlogs from "./components/BlogManager/allUsersBlog";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <Provider store={store}>
      {" "}
      {/* Wrap the entire app with Provider */}
      <Router>
        <ToastContainer />
        <Routes>
          <Route path="/" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/BlogManager" element={<BlogManager />} />
          <Route path="/AllUsersBlogs" element={<AllUsersBlogs />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
