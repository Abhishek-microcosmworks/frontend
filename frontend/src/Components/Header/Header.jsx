import React from 'react';

import PropTypes from 'prop-types';

import { Link, useNavigate } from 'react-router-dom';

import companyLogo from '../../assets/images/Company_Logo.png';

import './Header.css';

// import History from '../History/History';
// import Articles from '../Articles/Articles';

function Header(
  {
    isLoggedIn,
    setIsLoggedIn,
    setShowOtpForm,
    setShowLogin,
    setEmail,
  },
) {
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
        setShowLogin(true);
        navigate('/');
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('An error occurred during logout', error);
    }
  };

  return (
    <div className="navbar">
      <div className="logo">
        <img src={companyLogo} alt="Logo" />
      </div>
      <div className="nav-links">
        {isLoggedIn && <Link to="/">Articles</Link>}
        {isLoggedIn && <Link to="/history">History</Link>}

        <button className="btn_logout" type="button" onClick={handleLogout}>
          Logout
        </button>
      </div>
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
