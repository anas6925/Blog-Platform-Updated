import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup } from "../../Api";
import { toast } from "react-toastify";
import "./Login.css";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const validateForm = () => {
    if (username === "" && email === "" && password === "") {
      toast.error("Please Fill All The Fields");
      return;
    }
    if (username === "") {
      toast.error("Please Enter The User Name");
      return;
    }
    if (username.length < 3 || username.length > 20) {
      toast.error("Username Must Be Between 3 To 20 Characters Long");
      return;
    }
    if (email === "") {
      toast.error("Please Enter The User Email");
      return;
    }
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      toast.error("Please Enter A Valid Email Address.");
      return;
    }
    if (password === "") {
      toast.error("Please Enter The User Password");
      return;
    }
    if (password.length < 8) {
      toast.error("Password Must Be At Least 8 Characters Long");
      return;
    } else {
      return true;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        const response = await signup({
          username,
          email,
          password,
        });
        if (response.code === 201) {
          toast.success(response.message);
          navigate("/login");
        } else {
          return toast.error(response.message);
        }
      } catch (error) {
        console.error("Signup failed", error);
      }
    }
  };

  return (
    <div className="login-container">
      {" "}
      <h2 className="login-title">Signup</h2>
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Username</label>
          <input
            type="text"
            className="form-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Email</label>
          <input
            type="text"
            className="form-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="form-button">
          Signup
        </button>
      </form>
      <div className="login-link">
        <p>Already have an account?</p>
        <button className="link-button" onClick={() => navigate("/login")}>
          Login
        </button>
      </div>
    </div>
  );
};

export default Signup;
