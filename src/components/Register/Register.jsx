import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./register.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Otp } from "../Otp";
import { useAuth } from "../../context";

export const Register = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { setIsAuthenticated } = useAuth(); // Use the context to set authentication state

  const sendOTP = async () => {
    if (name.trim() === "" || email.trim() === "") {
      setError("Please enter both name and email.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/login", {
        email,
        name,
      });
      setShowOtpModal(true);
    } catch (error) {
      console.error("Error sending OTP:", error);
      setError("An error occurred while sending OTP. Please try again.");
    }
  };

  const handleVerifyOtp = async (enteredOtp) => {
    setIsLoading(true);
    console.log("Verifying OTP:", enteredOtp);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/verify-otp",
        {
          email,
          otp: enteredOtp,
        }
      );

      if (!response.data.data.error) {
        const { token, userId, email, tokenExp } = response.data.data;
        console.log('token-reg', token)
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
          <div className="logo">MC</div>
          <h1 className="mt-4 mb-4 text-black">Welcome</h1>
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
            <Button variant="primary" type="submit" className="w-100 mt-3">
              {isLoading ? "Sending OTP..." : "Send OTP"}
            </Button>
          </Form>
          <p className="mt-3 text-black">
          Already have an account? <Link to="/"> Login </Link>
          </p>
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