import nodemailer from 'nodemailer';
import aws from 'aws-sdk';

// Configure AWS SDK
aws.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

const transporter = nodemailer.createTransport({
  service: "ses",
  host: "no-reply@microcosmworks.com",
  port: 587,
  secure: true,
  auth: {
    user: process.env.AWS_USER,
    pass: process.env.AWS_PASS,
  },
});

export const sendOtpEmail = async (data, name) => {
  const otpExpTime = data.otpExp;
  const currentTime = Math.floor(new Date().getTime() / 1000);
  const remainingTimeInSeconds = otpExpTime - currentTime;

  let timeLeftMessage;
  if (remainingTimeInSeconds) {
    const minutesLeft = Math.floor(remainingTimeInSeconds / 60);
    timeLeftMessage = `${minutesLeft} minutes`;
  }

  try {
    const mailOptions = {
      from: 'no-reply@microcosmworks.com',
      to: data.email,
      subject: 'One-Time Password (OTP) for Login',
      html: `
       <html>
        <head>
          <style>
            body {
             font-family: 'Arial', sans-serif;
             background-color: #f4f4f4;
             margin: 0;
             padding: 0;
            }
            .container {
             max-width: 600px;
             margin: 0 auto;
             padding: 20px;
             border-radius: 10px;
             border: 1px solid #ddd;
             background-color: #fff;
             box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            h1 {
             color: teal;
             font-size: 24px;
             margin-bottom: 20px;
            }
            .otp {
             font-size: 32px;
             font-weight: bold;
             color: #333;
            }
            .message {
             font-size: 16px;
             color: #555;
             margin-bottom: 20px;
            }
            .footer {
             text-align: center;
             margin-top: 20px;
             color: #777;
            }
            a {
             color: #3498db;
             text-decoration: none;
            }
          </style>
        </head>
        <body>
          <div class="container">
           <h1>Hello <span style="color: #3498db">${name},</span></h1>
           <p class="message">Your One-Time Password (OTP) for login is: <span class="otp">${data.otp}</span></p>
           <p class="message">Please use this code within ${timeLeftMessage} to securely log in.</p>
           <p class="message">If you didn't request this, kindly disregard this email.</p>

           <p class="message">Thank you for choosing our services.</p>
           <p class="message">Best regards,<br>Media Connects Team</p>

           <div class="footer">
             <p>The demo app is developed by <a href="https://www.microcosmworks.com/">MicrocosmWorks</a></p>
           </div>
          </div>
        </body>
       </html>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    return { error: false, message: info };
  } catch (error) {
    console.log(error.message);
    return { error: true, message: error.message };
  }
};
