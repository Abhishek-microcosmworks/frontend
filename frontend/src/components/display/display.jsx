import React from 'react';
import { useNavigate } from 'react-router-dom';
import './display.css';

export const Display = () => {
  const navigate = useNavigate();

  const handleTryForFreeClick = () => {
    navigate('/login');
  };

  return (
    <div className="media-connects">
      <header className="header">
        <h1 className="brand-title"><strong>MEDIA CONNECTS</strong></h1>
        <button className="btn-primary" onClick={handleTryForFreeClick}>
          Try for Free
        </button>
      </header>

      <div className="main-container">
        <main className="main-content">
          <h2 className="title">Personalised Blog Generator</h2>
          <p className="subtitle"><strong>Write Smarter, Not Harder</strong></p>
          <p className="description">
            Our web application empowers users to automate blog content creation by utilizing existing blog data. Simply input the URL of any blog, and our tool will scrape the website, process the information, and generate meaningful, original content based on the scraped data.
          </p>
          <ul className="feature-list">
            <li>Automate blog content creation using existing blog data</li>
            <li>Input any blog URL and scrape data to generate meaningful content</li>
            <li>AI-driven content generation and NLP for human-like content</li>
            <li>Secure user authentication to safeguard your data and content</li>
            <li>Effortless blog creation tailored to your needs</li>
          </ul>
        </main>
      </div>

      <footer className="footer">
        <div className="footer-content">
          <p>&copy; 2023-2024 Media Connects. All Rights Reserved.</p>
          
          
        </div>
      </footer>
    </div>
  );
};