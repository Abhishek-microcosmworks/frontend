import React, { useState, useEffect } from 'react';

import Footer from '../Footer/Footer';

import Register from '../Register/Register';

import Login from '../Login/Login';

import './container.css';

function Container() {
  const [showLogin, setShowLogin] = useState(true);
  const [checkingToken, setCheckingToken] = useState(true);
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setShowLogin(true);
    } else {
      setShowLogin(true);
    }
    setCheckingToken(false);
  }, []);

  if (checkingToken) {
    return <div className="container" />;
  }

  return (
    <div className="container">
      <div className="background-image" />
      {showLogin ? (
        <Login setShowLogin={setShowLogin} />
      ) : (
        <Register setShowLogin={setShowLogin} />
      )}
      <Footer />
    </div>
  );
}

export default Container;
