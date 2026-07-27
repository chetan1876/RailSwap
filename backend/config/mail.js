const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/*
===================================
Send Email Utility
===================================
*/

const sendEmail = async ({
  to,
  subject,
  html,
  text,
}) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,

      to,

      subject,

      text,

      html,
    });

    console.log(
      `Email Sent Successfully: ${info.messageId}`
    );

    return info;
  } catch (error) {
    console.error(
      "Email Sending Failed:",
      error.message
    );

    throw new Error(
      "Failed to send email."
    );
  }
};

module.exports = {
  transporter,
  sendEmail,
};