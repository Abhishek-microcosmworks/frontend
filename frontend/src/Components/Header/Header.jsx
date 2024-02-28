import React, { useState, useEffect } from 'react';

import PropTypes from 'prop-types';

import { Link, useNavigate } from 'react-router-dom';

import axios from 'axios';

import companyLogo from '../../assets/images/media-connects-final.png';

import loaderIcon from '../../assets/images/loader.gif';

import './Header.css';

function Header(
  {
    isLoggedIn,
    setIsLoggedIn,
    setShowOtpForm,
    setShowLogin,
    setEmail,
    setName,
  },
) {
  const [isLoading, setIsLoading] = useState(false);
  const [showLinks, setShowLinks] = useState(false);
  const [showBurgerIcon, setShowBurgerIcon] = useState(false);
  const navigate = useNavigate();

  const serverUrl = 'https://mediaconnects.live/api';

  const handleLogout = async () => {
    const token = localStorage.getItem('token');
    try {
      setIsLoading(true);
      const res = await axios.post(`${serverUrl}/logout`, {
        token,
      });

      console.log(res.data.data);
      setIsLoggedIn(false);
      setEmail('');
      setName('');
      setShowOtpForm(false);
      localStorage.removeItem('token');
      localStorage.removeItem('email');
      localStorage.removeItem('expiresAt');
      localStorage.removeItem('name');
      setShowLogin(true);
      navigate('/');
      setIsLoading(false);
    } catch (error) {
      console.error('An error occurred during logout', error);
    }
  };

  const toggleLinks = () => {
    setShowBurgerIcon(!showBurgerIcon);
  };

  const handleKeyDown = (e) => {
    if (e.keyCode === 'Enter') {
      console.log('Enter-handleKeyDown');
    }
  };

  useEffect(() => {
    const handleResize = () => {
      const isSmallScreen = window.innerWidth < 768;
      setShowLinks(isSmallScreen);
    };

    // Initial check on component mount
    handleResize();

    // Add event listener for window resize
    window.addEventListener('resize', handleResize);

    // Remove event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="navbar">
      <div className="logo">
        <img src={companyLogo} alt="Logo" />
      </div>
      {showLinks ? (
        <div className="burger-icon-container">
          <div role="button" tabIndex={0} className="burger-icon" onClick={toggleLinks} onKeyDown={handleKeyDown}>
            &#9776;
          </div>
          {showBurgerIcon && (
            <div
              className="nav-links"
              style={{ display: showLinks ? 'flex' : 'block' }}
            >
              {isLoggedIn && <Link to="/">Craft Blog</Link>}
              {/* {isLoggedIn && <Link to="/history">Blogs</Link>} */}

              <button className="btn_logout" type="button" onClick={handleLogout}>
                { isLoading ? (
                  <img src={loaderIcon} alt="loader" height="20" width="20" />)
                  : 'Logout'}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="nav-links">
          {isLoggedIn && <Link to="/">Craft Blog</Link>}
          {isLoggedIn && <Link to="/history">Blogs</Link>}

          <button className="btn_logout" type="button" onClick={handleLogout}>
            { isLoading ? (
              <img src={loaderIcon} alt="loader" height="20" width="20" />)
              : 'Logout'}
          </button>
        </div>
      )}
    </div>
  );
}

Header.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  setIsLoggedIn: PropTypes.func.isRequired,
  setShowOtpForm: PropTypes.func.isRequired,
  setShowLogin: PropTypes.func.isRequired,
  setEmail: PropTypes.func.isRequired,
  setName: PropTypes.func.isRequired,
};

export default Header;
