import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { FaPlus, FaMinus, FaFile, FaEdit } from "react-icons/fa";
import { useAuth } from "../../context";
import { v4 as uuidv4 } from "uuid";
import "./dashboard-page.css";

export const Dashboard = () => {
  const [blogUrls, setBlogUrls] = useState([""]);
  const [currentPage, setCurrentPage] = useState("newBlog");
  const [generatedBlog, setGeneratedBlog] = useState("");
  const [editableBlog, setEditableBlog] = useState("");
  const [blogTitle, setBlogTitle] = useState("");
  const [blogs, setBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const { setIsAuthenticated } = useAuth();

  const API = "https://mediaconnects.live/api";

  const handleLogout = async () => {
    try {
      await axios.post(
        `${API}/logout`,
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
    const token = localStorage.getItem("auth-token");
    const email = localStorage.getItem("email");
    const requestId = uuidv4();
    setLoading(true);

    const options = {
      method: "POST",
      url: `${API}/article`,
      headers: {
        "Content-Type": "application/json",
        authorization: token,
      },
      data: { email, urls: blogUrls, requestId },
    };

    try {
      const response = await axios.request(options);
      const newBlog = response.data.data;

      setGeneratedBlog(newBlog.finalContent);
      setBlogTitle(newBlog.title);
      setEditableBlog(newBlog.finalContent);

      setSelectedBlog({
        _id: newBlog._id,
        title: newBlog.title,
        finalContent: newBlog.finalContent,
      });

      setCurrentPage("viewBlog");
      setIsEditing(false);
      setBlogUrls([""]);
      getAllBlogs();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveBlog = async () => {
    const token = localStorage.getItem("auth-token");

    const options = {
      method: "POST",
      url: `${API}/blog/edit/blog`,
      headers: {
        "Content-Type": "application/json",
        authorization: token,
      },
      data: {
        email: localStorage.getItem("email"),
        id: selectedBlog._id,
        title: blogTitle,
        blogContent: editableBlog,
      },
    };

    try {
      await axios.request(options);
      setSelectedBlog((prev) => ({
        ...prev,
        title: blogTitle,
        finalContent: editableBlog,
      }));
      setIsEditing(false);
      getAllBlogs();
    } catch (error) {
      console.error("Error saving blog:", error);
    }
  };

  const handleNewBlogClick = () => {
    setCurrentPage("newBlog");
    setSelectedBlog(null);
    setGeneratedBlog("");
    setBlogUrls([""]);
  };

  const getAllBlogs = async () => {
    try {
      const token = localStorage.getItem("auth-token");

      const options = {
        method: "POST",
        url: `${API}/get-blogs`,
        headers: {
          "Content-Type": "application/json",
          authorization: token,
        },
        data: { email: localStorage.getItem("email") },
      };

      const getBlogs = await axios.request(options);
      setBlogs(getBlogs.data.data);
    } catch (error) {
      console.log("error", error.message);
    }
  };

  const handleBlogClick = async (blogId) => {
    const token = localStorage.getItem("auth-token");

    const options = {
      method: "POST",
      url: `${API}/get-blog`,
      headers: {
        "Content-Type": "application/json",
        authorization: token,
      },
      data: { blogId },
    };

    const getBlogData = await axios.request(options);

    setSelectedBlog(getBlogData.data.data);
    setBlogTitle(getBlogData.data.data.title);
    setGeneratedBlog(getBlogData.data.data.finalContent);
    setEditableBlog(getBlogData.data.data.finalContent);
    setCurrentPage("viewBlog");
    setIsEditing(false);
  };

  useEffect(() => {
    getAllBlogs();
  }, []);

  const renderContent = () => {
    if (loading) {
      return (
        <div
          className="d-flex flex-column justify-content-center align-items-center"
          style={{ marginTop: "20%" }}
        >
          <div className="spinner-border text-dark mb-2" role="status"></div>
          <div>
            <span className="text-dark">Generating Blog please wait...</span>
          </div>
        </div>
      );
    }

    if (currentPage === "newBlog" || currentPage === "dashboard") {
      return (
        <div className="d-flex justify-content-center align-items-center">
          <div className="bg-light text-dark p-4 rounded input-group center-div">
            {blogUrls.map((url, index) => (
              <div key={index} className="d-flex align-items-center mb-3 w-100">
                <input
                  type="text"
                  className="form-control me-2"
                  placeholder="Blog Url..."
                  value={url}
                  onChange={(e) => updateBlogUrl(index, e.target.value)}
                  style={{ flex: 1 }} // This ensures the input takes most of the space
                />
                {blogUrls.length < 3 && (
                  <button
                    className="btn btn-outline-dark rounded-circle"
                    type="button"
                    onClick={addBlogUrl}
                  >
                    <FaPlus />
                  </button>
                )}
                {index > 0 && (
                  <button
                    className="btn btn-outline-dark rounded-circle ms-2"
                    type="button"
                    onClick={() => removeBlogUrl(index)}
                  >
                    <FaMinus />
                  </button>
                )}
              </div>
            ))}
            <button
              className="btn btn-dark w-40 mt-3 mx-auto d-block"
              onClick={generateBlog}
              disabled={!blogUrls[0].trim()}
            >
              GENERATE
            </button>
          </div>
        </div>
      );
    } else if (currentPage === "viewBlog") {
      return (
        <div className="view-blog-container">
          <div
            className="mt-4 bg-white text-dark p-3 rounded"
            style={{ width: "60%" }}
          >
            <h3>{blogTitle}</h3>
            {isEditing ? (
              <>
                <textarea
                  className="form-control mb-3"
                  rows="3"
                  value={blogTitle}
                  onChange={(e) => setBlogTitle(e.target.value)}
                />
                <textarea
                  className="form-control mb-3"
                  rows="10"
                  value={editableBlog}
                  onChange={(e) => setEditableBlog(e.target.value)}
                />
              </>
            ) : (
              <div className="scrollable-content">
                <p>{editableBlog}</p>
              </div>
            )}

            {/* Floating Save/Edit buttons on the right */}
            <div className="floating-buttons">
              {isEditing ? (
                <button
                  className="btn btn-dark mt-2 save-btn"
                  onClick={handleSaveBlog}
                >
                  Save Blog
                </button>
              ) : (
                <button
                  className="btn btn-dark mt-2 edit-btn"
                  onClick={() => setIsEditing(true)}
                >
                  <FaEdit /> Edit
                </button>
              )}
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="container-fluid bg-white text-dark min-vh-100">
      <div className="row min-vh-100">
        {/* Left Sidebar */}
        <div className="col-md-3 col-lg-2 bg-light p-4 border-end sidebar">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <span className="h3 mb-0 fw-bold">MEDIA CONNECTS</span>
          </div>
          <button
            className="btn btn-dark w-100 mb-3"
            onClick={handleNewBlogClick}
          >
            New Blog
          </button>
          <div className="sidebar-content">
            <h6 className="mb-3">Recent</h6>
            {blogs.length === 0 ? (
              <p className="text-muted">No blogs available.</p>
            ) : (
              <ul className="list-unstyled">
                {blogs.map((blog, i) => (
                  <li
                    key={i}
                    className="mb-2 text-truncate"
                    id={blog._id}
                    style={{ cursor: "pointer" }}
                    onClick={() => handleBlogClick(blog._id)}
                  >
                    <FaFile className="me-2 text-muted" /> {blog.title}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="mt-auto">
            <p className="text-muted mb-1">Private Policy</p>
            <p className="text-muted mb-0">Contact</p>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="col-md-9 col-lg-10 p-4 main-content">
          <div className="d-flex justify-content-center align-items-center mb-4">
            <span className="fw-bold font-css">Write Smarter, Not Harder</span>
          </div>
          {renderContent()}
        </div>
      </div>
      <button
        className="btn btn-dark position-fixed top-0 end-0 m-3"
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  );
};
