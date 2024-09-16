import React, { useState } from "react";
import axios from "axios";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { Otp } from "../otp";
import { useAuth } from "../../context";
import "bootstrap/dist/css/bootstrap.min.css";
import "./register.css";

export const Register = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { setIsAuthenticated } = useAuth();

  const API = "https://mediaconnects.live/api";

  const sendOTP = async () => {
    if (name.trim() === "" || email.trim() === "") {
      setError("Please enter both name and email.");
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post(`${API}/login`, {
        email,
        name,
      });
      setIsLoading(false);
      setShowOtpModal(true);
    } catch (error) {
      console.error("Error sending OTP:", error);
      setError("An error occurred while sending OTP. Please try again.");
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (enteredOtp) => {
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${API}/verify-otp`,
        {
          email,
          otp: enteredOtp,
        }
      );

      if (!response.data.data.error) {
        const { token, userId, email, tokenExp } = response.data.data;
        localStorage.setItem("auth-token", token);
        localStorage.setItem("userID", userId);
        localStorage.setItem("email", email);
        localStorage.setItem("tokenExp", tokenExp);
        setIsAuthenticated(true);
        navigate("/dashboard");
      } else {
        setError("Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setError("An error occurred during OTP verification. Please try again.");
    } finally {
      setIsLoading(false);
      setShowOtpModal(false);
    }
  };

  const handleResendOtp = () => {
    console.log("Resending OTP...");
    sendOTP();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(`Sending OTP to ${email} for user ${name}`);
    sendOTP();
  };

  return (
    <Container
      fluid
      className="login-container d-flex align-items-center justify-content-center bg-white"
    >
      <Row className="login-box">
        <Col xs={12} className="text-center">
        <h2 className="mt-3 text-black">Welcome to Media Connects</h2>
          <div className="logo">MC</div>
          <h1 className="mt-4 mb-4 text-black">Sign Up</h1>
          {error && <div className="alert alert-danger">{error}</div>}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formName" className="mb-3">
              <Form.Control
                className="form-control"
                type="text"
                placeholder="Name *"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="formEmail">
              <Form.Control
                type="email"
                placeholder="Email address *"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="dark" type="submit" className="w-100 mt-3" disabled={isLoading}>
              {isLoading ? "Sending OTP..." : "Send OTP"}
            </Button>
          </Form>
          <p className="mt-3 text-black">
            Already have an account? <Link to="/"> Login </Link>
          </p>

          {/* Conditional Spinner */}
          {isLoading && (
            <div className="spinner-container">
              <div className="spinner"></div>
            </div>
          )}
        </Col>
      </Row>

      {/* OTP Verification Modal */}
      <Otp
        show={showOtpModal}
        handleClose={() => setShowOtpModal(false)}
        email={email}
        handleVerifyOtp={handleVerifyOtp}
        handleResendOtp={handleResendOtp}
        isLoading={isLoading}
        error={error}
      />
    </Container>
  );
};
