import React, { useState } from 'react';

import PropTypes from 'prop-types';
import { Route, Routes } from 'react-router-dom';

import Articles from '../Articles/Articles';

import Header from '../Header/Header';

import History from '../History/History';

import './Register.css';

import companyLogo from '../../assets/images/Company_Logo.png';

function Register({ setShowLogin }) {
  const [errorMessage, setErrorMessage] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(30);
  const [disableResend, setDisableResend] = useState(false);
  const [incorrectAttempts, setIncorrectAttempts] = useState(0);
  const [otpExpired, setOtpExpired] = useState(false);

  const startTimer = () => {
    let count = 30;
    const timerId = setInterval(() => {
      count -= 1;
      setTimer(count);

      if (count === 0) {
        clearInterval(timerId);
        setDisableResend(false);
      }
    }, 1000);
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };
  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const handleGetOtp = async () => {
    console.log('handle otp', email);
    localStorage.setItem('email', email);
    try {
      const res = await fetch('http://localhost:5000/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, name, otp }),
      });
      console.log('email is being noticed', email);

      if (res.ok) {
        setSuccessMsg('OTP sent successfully');
        setShowOtpForm(true);
      } else {
        const errorData = await res.json();
        setErrorMessage(errorData.error);
        setIncorrectAttempts((prevAttempts) => prevAttempts + 1);
        if (incorrectAttempts >= 3) {
          setDisableResend(false); // Enable the resend button
          startTimer();
        }
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const userEmail = localStorage.getItem('email');
    console.log('handle register', userEmail);
    console.log('email before sending request', userEmail);

    const res = await fetch('http://localhost:5000/register', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({ userEmail, name, otp }),
    });
    console.log('register details, ', res);
    if (res.ok) {
      setSuccessMsg('User Registered Successfully');
      setIsLoggedIn(true);
      const data = await res.json();
      const tokenValue = data.token;
      // console.log(data);
      // console.log('my token', tokenValue);
      localStorage.setItem('token', tokenValue);
      localStorage.setItem('email', userEmail);
    } else {
      // console.log('no input ', res);
      const errorData = await res.json();
      console.log('my errors', errorData);
      if (errorData.error === 'please fill otp') {
        setErrorMessage('Please fill OTP ');
      } else if (errorData.error === 'Incorrect OTP') {
        setErrorMessage('Invalid otp. Please check your OTP');
        setIncorrectAttempts((prevAttempts) => prevAttempts + 1);
        if (incorrectAttempts >= 3) {
          setErrorMessage('Invalid otp. Please check your OTP');
          setDisableResend(false); // Enable the resend button
          startTimer();
        }
      } else if (errorData.error === 'OTP expired') {
        setErrorMessage('please regenerate otp');
        setOtpExpired(true);
        setDisableResend(false); // Enable the resend button
        startTimer();
      } else {
        setErrorMessage('An error occurred during login');
      }
    }
  };
  const handleResendOtp = async (e) => {
    e.preventDefault();
    console.log('my typing otp is/', otp);
    const userEmail = localStorage.getItem('email');

    const res = await fetch('http://localhost:5000/resend-otp', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({ userEmail, otp }),
    });
    console.log('resend otp', res);
    if (res.ok) {
      setSuccessMsg('OTP resent successfully');
      setIsLoggedIn(true);
      const data = await res.json();
      const tokenValue = data.token;
      console.log('resend otp', data);
      // console.log('my token', tokenValue);
      localStorage.setItem('token', tokenValue);
      localStorage.setItem('email', email);
      // localStorage.removeItem('otpEntered');
      setDisableResend(true);
      setTimer(30);
      startTimer();
    } else {
      const data = await res.json();
      console.log('else resend otp', data);
    }
  };

  const handleLogin = () => {
    setShowLogin(true);
  };

  if (successMsg || errorMessage) {
    setTimeout(() => {
      setSuccessMsg('');
      setErrorMessage('');
    }, 3000);
  }

  return (
    <div>
      {isLoggedIn ? (
        <>
          <Header
            setIsLoggedIn={setIsLoggedIn}
            setShowOtpForm={setShowOtpForm}
            isLoggedIn={isLoggedIn}
            setShowLogin={setShowLogin}
          />
          <Routes>
            <Route path="/" element={<Articles />} />
            <Route path="/history" element={<History />} />
          </Routes>
        </>
      ) : (
        <div>
          {showOtpForm ? (
            <>
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
                    name="otp"
                    onChange={handleOtpChange}
                    value={otp}
                  />
                </div>
                {(otpExpired || incorrectAttempts >= 3) && (
                  <button
                    className="resend-otp-btn"
                    onClick={handleResendOtp}
                    type="button"
                    disabled={disableResend}
                  >
                    Resend OTP
                    {disableResend ? `(${timer}s)` : ''}
                  </button>
                )}
                <button
                  className="btn_register "
                  onClick={handleRegister}
                  type="button"
                >
                  Register
                </button>
                {successMsg && (
                  <div style={{ color: 'green' }}>{successMsg}</div>
                )}
                {errorMessage && (
                  <div style={{ color: 'red' }}>{errorMessage}</div>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="logo">
                <img src={companyLogo} alt="Logo" />
              </div>
              <div className="register_container">
                <div className="heading">Register</div>
                <div className="email_label">
                  <input
                    className="input_label_email"
                    type="email"
                    placeholder="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={handleEmailChange}
                  />
                </div>
                <div className="name_label">
                  <input
                    className="input_label_name"
                    type="name"
                    name="name"
                    placeholder="name"
                    id="name"
                    value={name}
                    onChange={handleNameChange}
                  />
                </div>
                <button
                  className="get_otp"
                  onClick={handleGetOtp}
                  type="button"
                >
                  Get Otp
                </button>

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
                  <div className="register_here">
                    <span
                      onClick={handleLogin}
                      onKeyDown={(e) => e.keyCode === 13 && handleLogin()}
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
  // setIsLoggedIn: PropTypes.func.isRequired,
  // setShowOtpForm: PropTypes.func.isRequired,
  // showOtpForm: PropTypes.bool.isRequired,
};
export default Register;
