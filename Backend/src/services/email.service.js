// C:\Users\NxtWave\Downloads\code\Backend\src\services\email.service.js

import nodemailer from 'nodemailer';
import { config } from 'dotenv';
config(); // Load environment variables from .env file

// Create a reusable transporter object using the SMTP transport
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT, 10),
  secure: process.env.EMAIL_SECURE === 'true', // Use 'true' for port 465, false for 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // This should be the App Password if using Gmail with 2FA
  },
});

/**
 * Sends a welcome email to a new user upon successful registration.
 * @param {string} userName - The full name of the user.
 * @param {string} userEmail - The email address to send the welcome message to.
 */
export const sendWelcomeEmail = async (userName, userEmail) => {
  // Define the email content
  const mailOptions = {
    from: `"${process.env.FROM_NAME}" <${process.env.FROM_EMAIL}>`,
    to: userEmail,
    subject: "Welcome! Let's Create Your Resume with AI Resume Builder", // UPDATED SUBJECT LINE
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <h1 style="color: #4A90E2; text-align: center;">Welcome, ${userName}!</h1>
        <p>Thank you for signing up for AI Resume Builder. We're excited to have you on board.</p>
        <p>You can now start creating professional, ATS-friendly resumes designed to help you land your dream job in the tech industry.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a 
            href="${process.env.ALLOWED_SITE}/dashboard" 
            style="display: inline-block; padding: 12px 25px; background-color: #10b981; color: white; text-decoration: none; border-radius: 5px; font-size: 16px; font-weight: bold;"
          >
            Go to Your Dashboard
          </a>
        </div>
        <p style="margin-top: 20px; font-size: 12px; color: #888; text-align: center;">
          Best of luck with your job search!<br>
          &mdash; The ${process.env.FROM_NAME} Team
        </p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Welcome email successfully sent to ${userEmail}: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error(`Failed to send welcome email to ${userEmail}. Error: ${error.message}`);
    // We throw the error so the calling function can see that the email failed,
    // but the user registration itself should not fail because of this.
    throw new Error('Could not send the welcome email.');
  }
};
