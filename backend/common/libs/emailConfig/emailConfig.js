import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
 service: 'gmail',
host: 'smtp.gmail.com',
port: 465,
secure: true,
auth: {
  user: 'staragarwalkunal@gmail.com',
  pass: 'xeui ekow mhux pjjm',
  },
});

export const sendOtpEmail = (email, sendOTP) => {
  const mailOptions = {
    from: 'staragarwalkunal@gmail.com',
    to: email,
    subject: 'OTP for Login',
    text: `Your OTP for login is: ${sendOTP}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};
// service: 'gmail',
// host: 'smtp.gmail.com',
// port: 465,
// secure: true,
// auth: {
//   user: 'staragarwalkunal@gmail.com',
//   pass: 'xeui ekow mhux pjjm',
// },
