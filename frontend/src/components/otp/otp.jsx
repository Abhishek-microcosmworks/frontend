import React, { useState, useEffect } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import Loader from "../loader/Loader";
import './otp.css';

export const Otp = ({
  show,
  handleClose,
  email,
  handleVerifyOtp,
  handleResendOtp,
  isLoading,
  error,
}) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [canResend, setCanResend] = useState(false);
  const [timer, setTimer] = useState(30);

  useEffect(() => {
    if (!show) {
      setOtp(["", "", "", "", "", ""]);
      setTimer(30);
      setCanResend(false);
    }
  }, [show]);

  useEffect(() => {
    const countdown = setInterval(() => {
      if (timer > 0) {
        setTimer(timer - 1);
      } else {
        setCanResend(true);
        clearInterval(countdown);
      }
    }, 1000);

    return () => clearInterval(countdown);
  }, [timer]);

  const handleOtpChange = (index, value) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleResendClick = () => {
    if (canResend) {
      handleResendOtp();
      setCanResend(false);
      setTimer(30);
    }
  };

  const handleVerify = () => {
    const enteredOtp = otp.join("");
    handleVerifyOtp(enteredOtp);
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title className="verify otp-title">Verify OTP</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {isLoading && <Loader />}
        <p className="p-text">
          Please enter the OTP sent to your registered email address.
        </p>
        <div className="d-flex justify-content-between mb-3 ">
          {otp.map((digit, index) => (
            <Form.Control
              key={index}
              id={`otp-${index}`}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              style={{ width: "40px", textAlign: "center" }}
            />
          ))}
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <Button variant="dark" onClick={handleVerify} className="w-100">
          Verify
        </Button>
        <Button
          variant="link"
          onClick={handleResendClick}
          disabled={!canResend}
          className="w-100"
        >
          Resend OTP {!canResend && `(${timer}s)`}
        </Button>
      </Modal.Body>
    </Modal>
  );
};
