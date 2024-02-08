import React, { useState, useEffect } from 'react';

import PropTypes from 'prop-types';

import { Route, Routes } from 'react-router-dom';

import { ToastContainer, toast } from 'react-toastify';

import Articles from '../Articles/Articles';

import History from '../History/History';

import Header from '../Header/Header';

import companyLogo from '../../assets/images/media-connects-final.png';

import loaderIcon from '../../assets/images/loader.gif';

import 'react-toastify/dist/ReactToastify.css';

import './Login.css';

function Login({ setShowLogin }) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [otp, setOtp] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginError, setLoginError] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);
  const [timer, setTimer] = useState(30);
  const [disableResend, setDisableResend] = useState(true);
  const [incorrectAttempts, setIncorrectAttempts] = useState(0);
  const [buttonOpacity, setButtonOpacity] = useState(1);
  const [otpExpired, setOtpExpired] = useState(false);

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

  // const verifyToken = async () => {
  //   try {
  //     const userToken = localStorage.getItem('token');

  //     const res = await fetch(`${serverUrl}/verify-token`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         authorization: userToken,
  //       },
  //       body: JSON.stringify({ userToken }),
  //     });
  //     if (res.ok) {
  //       setIsLoggedIn(true);
  //       setShowOtpForm(false);
  //     } else {
  //       const errorData = await res.json();
  //       if (errorData.expired) {
  //         localStorage.removeItem('token');
  //         localStorage.removeItem('email');
  //         setIsLoggedIn(false);
  //       }
  //     }
  //   } catch (error) {
  //     console.error('Error verification in token:', error);
  //   }
  // };
  // const autoVerifyToken = async () => {
  //   try {
  //     userToken = localStorage.getItem('token');
  //     const res = await fetch(`${serverUrl}/autoverify-token`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ userToken }),
  //     });
  //     if (res.ok) {
  //       localStorage.removeItem('token');
  //       localStorage.removeItem('email');

  //       setIsLoggedIn(false);
  //       setShowOtpForm(false);
  //       setEmail('');
  //     }
  //   } catch (error) {
  //     console.error('Error auto-verifying token:', error);
  //   }
  // };
  useEffect(() => {
    // Use a timeout to hide the overlay after a certain time (e.g., 2 seconds)
    const timeoutId = setTimeout(() => {
      setShowOverlay(false);
    }, 200);

    return () => clearTimeout(timeoutId);
  }, []); // Run this effect only once when the component mounts

  // useEffect(() => {
  //   // verifyToken();
  //   // autoVerifyToken();

  //   //let intervalId;

  //   // if (userToken && isLoggedIn) {
  //   //   intervalId = setInterval(() => {
  //   //     verifyToken();
  //   //   }, 10000);
  //   // }

  //   return () => clearInterval(intervalId);
  // }, [userToken, isLoggedIn]);

  // useEffect(() => {
  //   // autoVerifyToken();

  //   let intervalId;

  //   if (userToken && isLoggedIn) {
  //     intervalId = setInterval(() => {
  //       // autoVerifyToken();
  //     }, 10000);
  //   }

  //   return () => clearInterval(intervalId);
  // }, [userToken, isLoggedIn]);
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };
  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const handleGetOtp = async () => {
    localStorage.setItem('email', email);

    const userToken = localStorage.getItem('token');

    try {
      setIsLoading(true);
      const res = await fetch(`${serverUrl}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: userToken,
        },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setSuccessMsg('OTP sent successfully');
        setShowOtpForm(true);
        setDisableResend(false);
      } else {
        const errorData = await res.json();
        setErrorMessage(errorData.message);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const res = await fetch(`${serverUrl}/verify-otp`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({ email, otp }),
    });
    if (res.ok) {
      const data = await res.json();
      const { token, tokenExp } = data.data.data;
      localStorage.setItem('token', token);
      localStorage.setItem('email', email);
      localStorage.setItem('expiresAt', tokenExp);
      setIsLoggedIn(true);
      setIsLoading(false);
    } else {
      const errorData = await res.json();
      console.log('my errors', errorData);
      if (errorData.message === 'please fill otp') {
        setLoginError('Please fill OTP ');
      } else if (errorData.message === 'Incorrect OTP') {
        setLoginError('Invalid otp. Please check your OTP');
        setIncorrectAttempts((prevAttempts) => prevAttempts + 1);
        if (incorrectAttempts >= 3) {
          setLoginError('Invalid otp. Please check your OTP');
          setDisableResend(false);
          startTimer();
        }
      } else if (errorData.message === 'OTP expired') {
        setLoginError('Otp expired!! Please resend otp');
        setOtpExpired(true);
        setDisableResend(false);
        startTimer();
      } else {
        setLoginError('An error occurred during login');
      }
    }
  };
  const handleResendOtp = async (e) => {
    e.preventDefault();
    setSuccessMsg('otp resent successfully');
    setDisableResend(true);
    startTimer(30);

    const res = await fetch(`${serverUrl}/resend-otp`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
    if (res.ok) {
      setSuccessMsg('OTP resent successfully');
      setDisableResend(true);
      setTimer(30);
      startTimer();
    } else {
      const data = await res.json();
      console.log('else resend otp', data);
    }
  };
  useEffect(() => {
    setButtonOpacity(disableResend ? 0.5 : 1);
  }, [disableResend]);

  const handleRegister = () => {
    setShowLogin(false);
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
      {showOverlay && (
        <div className="transparent-overlay">
          {/* <img src={loader} alt="Loading..." className="loading-gif" /> */}
        </div>
      )}

      {isLoggedIn ? (
        <>
          <Header
            setIsLoggedIn={setIsLoggedIn}
            setShowOtpForm={setShowOtpForm}
            isLoggedIn={isLoggedIn}
            showOtpForm={showOtpForm}
            setShowLogin={setShowLogin}
            setEmail={setEmail}
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
                <h2>Enter OTP</h2>
                <p>We have sent a 6-digit OTP in your email.</p>
                <div>
                  <input
                    type="text"
                    className="otp-input"
                    maxLength="6"
                    onChange={handleOtpChange}
                  />
                </div>
                {(showOtpForm || otpExpired || incorrectAttempts >= 3) && (
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
                      Resend OTP
                      {disableResend ? `(${timer}s)` : ''}
                    </span>
                  </div>
                )}

                <button
                  className="submit-btn"
                  onClick={handleLogin}
                  type="button"
                >
                  Submit
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
                  <div className="heading">Login</div>
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
                  <button
                    disabled={isLoading}
                    className="get_otp_login"
                    onClick={handleGetOtp}
                    type="button"
                  >
                    { isLoading ? (
                      <img src={loaderIcon} alt="loader" height="20" width="20" />)
                      : 'Get Otp'}
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
                        Don&apos;t have an account?
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
                      Register
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
Login.propTypes = {
  setShowLogin: PropTypes.func.isRequired,
};

export default Login;
