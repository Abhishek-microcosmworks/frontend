import React, { useState, useEffect } from 'react';

import PropTypes from 'prop-types';

import { Link, useNavigate } from 'react-router-dom';

import companyLogo from '../../assets/images/media-connects-final.png';

import './Header.css';

function Header(
  {
    isLoggedIn,
    setIsLoggedIn,
    setShowOtpForm,
    setShowLogin,
    setEmail,
  },
) {
  const [showLinks, setShowLinks] = useState(false);
  const [showBurgerIcon, setShowBurgerIcon] = useState(false);
  const navigate = useNavigate();
  const serverUrl = 'https://mediaconnects.live/api';
  const handleLogout = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${serverUrl}/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      if (response.ok) {
        setIsLoggedIn(false);
        setEmail('');
        setShowOtpForm(false);
        localStorage.removeItem('token');
        localStorage.removeItem('email');
        localStorage.removeItem('expiresAt');
        setShowLogin(true);
        navigate('/');
      } else {
        console.error('Logout failed');
      }
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
              {isLoggedIn && <Link to="/">Articles</Link>}
              {isLoggedIn && <Link to="/history">History</Link>}

              <button className="btn_logout" type="button" onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="nav-links">
          {isLoggedIn && <Link to="/">Articles</Link>}
          {isLoggedIn && <Link to="/history">History</Link>}

          <button className="btn_logout" type="button" onClick={handleLogout}>
            Logout
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
};

export default Header;
