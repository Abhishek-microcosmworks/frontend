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

export const sendOtpEmail = async (data) => {

  try {
    const mailOptions = {
      from: 'staragarwalkunal@gmail.com',
      to: data.email,
      subject: 'One-Time Password (OTP) for Login',
      //text: `Your OTP for login is: ${sendOTP}`,
      html: `<p><pre>Dear ${data.email},
  
      We hope this message finds you well. 
  
      As a part of our ongoing commitment to ensuring the security of your account, we have generated a One-Time Password (OTP) specifically for your login process.
  
      Your OTP for login is: <b>${data.otp}</b>
  
      Please enter this code within the specified time frame to securely complete the login process. If you have not initiated this request, kindly ignore this email.
  
      Thank you for choosing our services.
  
      Best regards,
      Microcosmworks
      </pre></p>
    `,
    };

    const info = await transporter.sendMail(mailOptions);
    return { error: false, message: info } 

  } catch (error) {
    console.log(error.message)
    return { error: true, message: error.message };
  }
};
// service: 'gmail',
// host: 'smtp.gmail.com',
// port: 465,
// secure: true,
// auth: {
//   user: 'staragarwalkunal@gmail.com',
//   pass: 'xeui ekow mhux pjjm',
// },
