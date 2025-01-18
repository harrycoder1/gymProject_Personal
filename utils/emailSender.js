import nodemailer from "nodemailer";

// Configure the transporter
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com", // Use your email provider's SMTP server
  port: 587, // Typically 587 for TLS
  secure: false, // Use false for TLS
  auth: {
    user: process.env.SMTP_USER, // Your email address
    pass: process.env.SMTP_PASS, // Your email password or app-specific password
  },
});

// Send email function
export const sendEmail = async (to, subject, text, html) => {
  try {
    const mailOptions = {
      from: process.env.SMTP_USER, // Sender address
      to, // Recipient address
      subject, // Email subject
      text, // Plain text body
      html, // HTML body
    };

    // Send email
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}`);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};
