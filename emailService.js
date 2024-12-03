const nodemailer = require("nodemailer");
require("dotenv").config();

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

const sendWelcomeEmail = async (userEmail, userName) => {
  const mailOptions = {
    from: process.env.EMAIL,
    to: userEmail,
    subject: "Welcome to Wanderlust!",
    text: `Hi ${userName},\n\nThank you for signing up with Wanderlust! We’re thrilled to have you with us.\n\nHappy traveling!\n\nBest,\nThe Wanderlust Team`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Welcome email sent to:", userEmail);
  } catch (error) {
    console.error("Error sending welcome email:", error);
  }
};

module.exports = { sendWelcomeEmail };
