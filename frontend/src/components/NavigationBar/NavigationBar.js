import React, { useState, useCallback, useMemo } from "react";
import { Collapse, Navbar, NavbarToggler, Nav, NavItem } from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import "./NavigationBar.css";
import { useDispatch } from "react-redux";
import { clearBlogs } from "../../redux/blogSlice.js";
function NavigationBar() {
  const pathName = useMemo(
    () => window.location.pathname,
    [window.location.pathname]
  );
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);
  const dispatch = useDispatch();
  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(clearBlogs());
    navigate("/login");
  };

  return (
    <div className="navBar1">
      <Navbar
        color="dark"
        dark
        expand="md"
        className="fixed-top d-flex justify-content-between"
      >
        <NavbarToggler onClick={toggle} style={{ width: "auto" }} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="mr-auto" navbar>
            <NavItem>
              <Link
                to="/BlogManager"
                onClick={toggle}
                className={`nav-link ${
                  pathName === "/BlogManager" ? "active" : ""
                }`}
              >
                My Blogs
              </Link>
            </NavItem>
            <NavItem>
              <Link
                to="/AllUsersBlogs"
                onClick={toggle}
                className={`nav-link ${
                  pathName === "/AllUsersBlogs" ? "active" : ""
                }`}
              >
                All Blogs
              </Link>
            </NavItem>
          </Nav>

          <Nav className="ml-auto" navbar>
            <NavItem>
              <Link to="/login" onClick={handleLogout} className="nav-link">
                Logout
              </Link>
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
    </div>
  );
}

export default NavigationBar;
