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

// --- NEW FUNCTION FOR PASSWORD RESET ---
export const sendPasswordResetEmail = async (userName, userEmail, resetLink) => {
    const mailOptions = {
      from: `"${process.env.FROM_NAME}" <${process.env.FROM_EMAIL}>`,
      to: userEmail,
      subject: "Password Reset Request – NxtResume",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
          <h1 style="color: #4A90E2; text-align: center;">Password Reset Request</h1>
          <p>Hello ${userName},</p>
          <p>We received a request to reset the password for your NxtResume account. If you did not make this request, you can safely ignore this email.</p>
          <p>To reset your password, please click the button below. This link is valid for 15 minutes.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" style="display: inline-block; padding: 12px 25px; background-color: #4A90E2; color: white; text-decoration: none; border-radius: 5px; font-size: 16px; font-weight: bold;">
              Reset Your Password
            </a>
          </div>
          <p>If you're having trouble with the button, you can also copy and paste this link into your browser:</p>
          <p style="word-break: break-all; font-size: 12px; color: #666;">${resetLink}</p>
          <p style="margin-top: 20px; font-size: 12px; color: #888; text-align: center;">
            Thank you,<br>
            &mdash; The ${process.env.FROM_NAME} Team
          </p>
        </div>
      `,
    };
  
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log(`Password reset email sent to ${userEmail}: ${info.messageId}`);
      return info;
    } catch (error) {
      console.error(`Failed to send password reset email to ${userEmail}. Error: ${error.message}`);
      throw new Error('Could not send the password reset email.');
    }
  };
