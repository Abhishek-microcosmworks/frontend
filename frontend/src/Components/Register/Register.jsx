import React, { useState, useEffect } from 'react';

import PropTypes from 'prop-types';

import { Route, Routes } from 'react-router-dom';

import { ToastContainer, toast } from 'react-toastify';

import axios from 'axios';

import Articles from '../Articles/Articles';

import History from '../History/History';

import Header from '../Header/Header';

import companyLogo from '../../assets/images/media-connects-final.png';

import loaderIcon from '../../assets/images/loader.gif';

import 'react-toastify/dist/ReactToastify.css';

import './Register.css';

function Register({ setShowLogin }) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [otp, setOtp] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginError, setLoginError] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [timer, setTimer] = useState(30);
  const [disableResend, setDisableResend] = useState(true);
  const [buttonOpacity, setButtonOpacity] = useState(1);

  useEffect(() => {
    const authToken = localStorage.getItem('token');
    const expireTime = localStorage.getItem('expiresAt');
    const currentTimestamp = Math.floor(Date.now() / 1000);
    if (authToken !== null && expireTime > currentTimestamp) {
      setIsLoggedIn(true);
      setIsLoading(false);
    }
  });

  const startTimer = () => {
    let count = 30;
    setDisableResend(true);
    const timerId = setInterval(() => {
      count -= 1;
      setTimer(count);

      if (count === 0) {
        clearInterval(timerId);
        setDisableResend(false);
      }
    }, 1000);
  };

  const serverUrl = 'https://mediaconnects.live/api';
  useEffect(() => {
    if (showOtpForm) {
      startTimer();
      // Display toast message for 5 seconds
      toast.success('Otp has been send to your Email', {
        autoClose: 5000,
        style: {
          fontFamily: 'Noto Sans',
          fontSize: '15px',
          fontWeight: '600',
          borderRadius: '14px',
        },
      });
    }
  }, [showOtpForm]);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const handleGetOtp = async () => {
    if (!email || !name) {
      setErrorMessage('Please enter your credentials!');
      return;
    }
    setIsLoading(true);
    localStorage.setItem('email', email);
    localStorage.setItem('name', name);
    try {
      await axios.post(
        `${serverUrl}/register`,
        {
          email,
          name,
        },
      );
      setShowOtpForm(true);
      setDisableResend(false);
      setIsLoading(false);
    } catch (error) {
      setErrorMessage(error.response.data.error);
      setIsLoading(false);
    }
  };

  const handleLogin = async (e) => {
    setIsLoading(true);
    e.preventDefault();
    try {
      const res = await axios.post(`${serverUrl}/verify-otp`, {
        email,
        name,
        otp,
      });
      const { token, tokenExp } = res.data.data.data;
      localStorage.setItem('token', token);
      localStorage.setItem('email', email);
      localStorage.setItem('expiresAt', tokenExp);
      setIsLoggedIn(true);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      const errorData = error.response.data;
      setLoginError(errorData.message);
    }
  };
  const handleResendOtp = async (e) => {
    e.preventDefault();
    setDisableResend(true);
    startTimer(30);
    setTimer(30);
    try {
      const res = await axios.post(`${serverUrl}/resend-otp`, {
        email, name,
      });
      // console.log('res in resend', res);
      setSuccessMsg(res.data.message);
      setDisableResend(true);
    } catch (error) {
      console.error('Error occurred while resending OTP:', error);
      // Handle error here
    }
  };
  useEffect(() => {
    setButtonOpacity(disableResend ? 0.5 : 1);
  }, [disableResend]);

  const handleRegister = () => {
    setShowLogin(true);
  };
  if (loginError || errorMessage) {
    setTimeout(() => {
      setLoginError('');
      setErrorMessage('');
    }, 5000);
  }
  if (successMsg) {
    setTimeout(() => {
      setSuccessMsg('');
    }, 8000);
  }
  return (
    <div style={{ height: '100%' }}>
      {isLoggedIn ? (
        <>
          <Header
            setIsLoggedIn={setIsLoggedIn}
            setShowOtpForm={setShowOtpForm}
            isLoggedIn={isLoggedIn}
            showOtpForm={showOtpForm}
            setShowLogin={setShowLogin}
            setEmail={setEmail}
            setName={setName}
          />
          {/* <Articles /> */}
          <Routes>
            <Route path="/" element={<Articles />} />
            <Route path="/history" element={<History />} />
          </Routes>
        </>
      ) : (
        <div style={{ height: '100%' }}>
          {showOtpForm ? (
            <div style={{ height: '100%' }}>
              <ToastContainer />
              <div className="logo">
                <img src={companyLogo} alt="Logo" />
              </div>
              <div className="otp-container">
                <span className="otp-heading">Please enter your 4 digit code</span>
                <p className="otp-text">Check your email</p>
                <div className="otp-input-container">
                  <input
                    type="text"
                    className="otp-input"
                    maxLength="6"
                    onChange={handleOtpChange}
                  />
                </div>
                {(showOtpForm) && (
                  <div className="resend-otp-btn">
                    <span
                      onClick={handleResendOtp}
                      onKeyDown={(e) => e.keyCode === 13 && handleResendOtp()}
                      tabIndex={0}
                      role="button"
                      style={{
                        opacity: buttonOpacity,
                        pointerEvents: disableResend ? 'none' : 'auto',
                      }}
                      disabled={disableResend}
                    >
                      Resend Code
                      {disableResend ? ` in (${timer}s)` : ''}
                    </span>
                  </div>
                )}

                <button
                  disabled={isLoading}
                  className="submit-btn"
                  onClick={handleLogin}
                  type="button"
                >
                  { isLoading ? (
                    <img src={loaderIcon} alt="loader" height="20" width="20" />)
                    : 'Submit'}
                </button>
                {loginError && <div style={{ color: 'red' }}>{loginError}</div>}
                {successMsg && (
                  <div style={{ color: 'green' }}>{successMsg}</div>
                )}
                {errorMessage && (
                  <div style={{ color: 'red' }}>{errorMessage}</div>
                )}
              </div>
            </div>
          ) : (
            <>
              <div className="logo">
                <img src={companyLogo} alt="Logo" />
              </div>
              <div className="container-login-content">
                <div className="info-container">
                  <div className="heading-text">
                    <span>Transform Blogs into Brilliance: Your Inspiration, Our Creation!</span>
                    {/* <span>Transforming Inspiration into Impactful Content</span> */}
                  </div>
                </div>
                <div className="login_container">
                  <div className="heading">Welcome To the Media Connects</div>
                  {/* <button className="google-button" type="button">
                    Continue with Google
                  </button>
                  <span className="or">or</span> */}
                  <div className="email_label">
                    <input
                      disabled={isLoading}
                      className="input_label_email_login"
                      type="email"
                      placeholder="email"
                      id="email"
                      value={email}
                      onChange={handleEmailChange}
                    />
                  </div>
                  <div className="name_label_login">
                    <input
                      className="input_label_name_login"
                      type="name"
                      name="name"
                      placeholder="name"
                      id="name"
                      value={name}
                      onChange={handleNameChange}
                    />
                  </div>
                  <button
                    disabled={isLoading}
                    className="get_otp_login"
                    onClick={handleGetOtp}
                    type="button"
                  >
                    { isLoading ? (
                      <img src={loaderIcon} alt="loader" height="20" width="20" />)
                      : 'Register'}
                  </button>

                  {loginError && <div style={{ color: 'red' }}>{loginError}</div>}
                  {successMsg && (
                    <div style={{ color: 'green' }}>{successMsg}</div>
                  )}
                  {errorMessage && (
                    <div style={{ color: 'red' }}>{errorMessage}</div>
                  )}

                  <div className="noaccount_container">
                    <div>
                      <span className="noaccount_text">
                        Already have an account?
                      </span>
                    </div>
                  </div>
                  <div className="register_here">
                    <span
                      onClick={handleRegister}
                      onKeyDown={(e) => e.keyCode === 13 && handleRegister()}
                      tabIndex={0}
                      role="button"
                    >
                      Login
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
Register.propTypes = {
  setShowLogin: PropTypes.func.isRequired,
};

export default Register;
