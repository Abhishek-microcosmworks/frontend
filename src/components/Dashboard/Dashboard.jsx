import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { FaPlus, FaMinus, FaFile } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context";
import "./dashboard.css";

export const Dashboard = () => {
  const [blogUrls, setBlogUrls] = useState([""]);
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [generatedBlog, setGeneratedBlog] = useState("");
  const [editableBlog, setEditableBlog] = useState("");
  const [blogs, setBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };
  const { setIsAuthenticated } = useAuth();

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/logout",
        {
          token: localStorage.getItem("auth-token"),
        },
        {
          headers: {
            Authorization: localStorage.getItem("auth-token"),
          },
        }
      );
      localStorage.removeItem("auth-token");
      localStorage.removeItem("tokenExp");
      localStorage.removeItem("userID");
      localStorage.removeItem("email");

      setIsAuthenticated(false);
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const addBlogUrl = () => {
    if (blogUrls.length < 3) {
      setBlogUrls([...blogUrls, ""]);
    }
  };

  const removeBlogUrl = (index) => {
    if (blogUrls.length > 1) {
      const newUrls = blogUrls.filter((_, i) => i !== index);
      setBlogUrls(newUrls);
    }
  };

  const updateBlogUrl = (index, value) => {
    const newUrls = [...blogUrls];
    newUrls[index] = value;
    setBlogUrls(newUrls);
  };

  const generateBlog = async () => {
    const token = localStorage.getItem("token");
    console.log("Token:", token);
    console.log("Request payload:", {
      title: blogUrls[0],
      urls: blogUrls.slice(1),
    });

    const options = {
      method: "POST",
      url: "http://localhost:5000/api/article",
      headers: {
        "Content-Type": "application/json",
        authorization: token,
      },
      data: { title: "chat-gpt", urls: blogUrls },
    };

    try {
      const response = await axios.request(options);
      console.log(response.data.data.finalContent);
      setGeneratedBlog(response.data.data.finalContent);
      setEditableBlog(response.data.data.finalContent); 
      setSelectedBlog(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSaveBlog = () => {
    console.log("Saving blog:", editableBlog);
  };

  const getAllBlogs = async () => {
    const token = localStorage.getItem("auth-token");

    const options = {
      method: "POST",
      url: "http://localhost:5000/api/get-blogs",
      headers: {
        "Content-Type": "application/json",
        authorization: token,
      },
      data: { email: localStorage.getItem("email") },
    };

    const getBlogs = await axios.request(options);
    setBlogs(getBlogs.data.data);
  };

  const handleBlogClick = async(blogId) => {

    const token = localStorage.getItem("auth-token");

    const options = {
      method: "POST",
      url: "http://localhost:5000/api/get-blog",
      headers: {
        "Content-Type": "application/json",
        authorization: token,
      },
      data: { blogId },
    };

    const getBlogData = await axios.request(options);

    console.log('getBlogData===', getBlogData.data);
    // setBlogs(getBlogs.data.data);

    // setSelectedBlog(blog);
    // setGeneratedBlog(blog.content);
    // setEditableBlog(blog.content);
  };

  useEffect(() => {
    getAllBlogs();
  }, []);

  const renderContent = () => {
    if (selectedBlog || generatedBlog) {
      return (
        <div className="mt-4 bg-white text-dark p-3 rounded">
          <h3>{selectedBlog ? selectedBlog.title : "Generated Blog"}</h3>
          <textarea
            className="form-control mb-3"
            rows="10"
            value={editableBlog}
            onChange={(e) => setEditableBlog(e.target.value)}
          />
          <button className="btn btn-success" onClick={handleSaveBlog}>
            Save Blog
          </button>
        </div>
      );
    } else {
      return (
        <>
          <div className="bg-light text-dark p-4 rounded d-flex flex-column align-items-center div-styles">
            <input
              type="text"
              className="form-control input mt-0 mb-3 w-100 input-styles"
              placeholder="Blog title..."
            />
            {blogUrls.map((url, index) => (
              <div key={index} className="input-group mb-3 w-100">
                <input
                  type="text"
                  className="form-control input mt-0 input-styles"
                  placeholder="Blog Url..."
                  value={url}
                  onChange={(e) => updateBlogUrl(index, e.target.value)}
                />
                {blogUrls.length < 3 && (
                  <button
                    className="btn btn-outline-success rounded-circle ms-2 circular-btn"
                    type="button"
                    onClick={() => addBlogUrl()}
                  >
                    <FaPlus />
                  </button>
                )}
                {index > 0 && (
                  <button
                    className="btn btn-outline-success rounded-circle ms-2 circular-btn"
                    type="button"
                    onClick={() => removeBlogUrl(index)}
                  >
                    <FaMinus />
                  </button>
                )}
              </div>
            ))}
            <button className="btn btn-success w-100 mt-3 fw-bold" onClick={generateBlog}>
              GENERATE
            </button>
          </div>
        </>
      );
    }
  };

  return (
    <div className="container-fluid bg-white text-dark min-vh-100">
      <div className="row min-vh-100 flex-column flex-lg-row">
        {/* Main Content */}
        <div className="col-12 col-lg-8 p-4 order-1 order-lg-2">
          <nav className="navbar navbar-light bg-white border-bottom mb-4">
            <div className="container-fluid">
              <span
                className="fs-1 navbar-brand fw-bold mx-auto"
                onClick={() => {
                  setCurrentPage("dashboard");
                  setSelectedBlog(null); // Reset selected blog when going back to dashboard
                }}
                style={{ cursor: "pointer" }}
              >
                Craft a blog
              </span>
              <button className="btn btn-danger" onClick={handleLogout}>
                Log out
              </button>
            </div>
          </nav>
          {renderContent()}
        </div>

        {/* Left Sidebar */}
        <div className="col-12 col-lg-2 bg-light p-4 border-end order-2 order-lg-1">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <span className="h4 mb-0 fw-bold">MEDIA CONNECTS</span>
          </div>
          <button
            className="btn btn-success w-100 mb-3"
            onClick={() => {
              setCurrentPage("dashboard");
              setSelectedBlog(null); // Reset selected blog when creating a new blog
            }}
          >
            New Blog
          </button>
          <h6 className="mb-3">Recent</h6>
          <ul className="list-unstyled">
            {blogs.map((blog, i) => (
              <li key={i} className="mb-2" style={{ cursor: 'pointer' }} id={blog._id} onClick={() => handleBlogClick(blog._id)}>
                <FaFile className="me-2 text-muted" /> {blog.title}
              </li>
            ))}
          </ul>
          <button className="btn btn-link text-primary p-0">Show more</button>
          <div className="mt-5">
            <p className="text-muted">Help</p>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="col-12 col-lg-2 bg-light p-4 border-start order-3">
          {selectedBlog || generatedBlog ? (
            <div className="d-flex flex-column justify-content-between align-items-center mb-4">
              <button className="btn btn-success w-100 mb-3">Edit</button>
              <button className="btn btn-success w-100">Regenerate</button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
