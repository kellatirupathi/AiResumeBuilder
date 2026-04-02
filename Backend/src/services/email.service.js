// C:\Users\NxtWave\Downloads\code\Backend\src\services\email.service.js

import { config } from 'dotenv';
config();

const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

const sendEmail = async ({ to, subject, htmlContent }) => {
  const response = await fetch(BREVO_API_URL, {
    method: 'POST',
    headers: {
      'api-key': process.env.BREVO_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      sender: { name: process.env.FROM_NAME, email: process.env.FROM_EMAIL },
      to,
      subject,
      htmlContent,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Brevo API request failed');
  }

  return response.json();
};

/**
 * Sends a welcome email to a new user upon successful registration.
 */
export const sendWelcomeEmail = async (userName, userEmail) => {
  try {
    const info = await sendEmail({
      to: [{ email: userEmail, name: userName }],
      subject: "Welcome! Let's Create Your Resume with AI Resume Builder",
      htmlContent: `
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
    });
    console.log(`Welcome email successfully sent to ${userEmail}`);
    return info;
  } catch (error) {
    console.error(`Failed to send welcome email to ${userEmail}. Error: ${error.message}`);
    throw new Error('Could not send the welcome email.');
  }
};

/**
 * Sends a reminder email to users who signed up 10 days ago with no resume.
 */
export const sendReminderEmail = async (userName, userEmail) => {
  try {
    const info = await sendEmail({
      to: [{ email: userEmail, name: userName }],
      subject: "Your resume is waiting — get started on NxtResume!",
      htmlContent: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
          <h1 style="color: #6366f1; text-align: center;">Hey ${userName}, your resume is waiting!</h1>
          <p>You signed up for NxtResume 10 days ago — but you haven't created your first resume yet.</p>
          <p>It only takes a few minutes. Pick a template, fill in your details, and let our AI help you craft a professional, ATS-friendly resume that gets noticed.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a
              href="${process.env.ALLOWED_SITE}/dashboard"
              style="display: inline-block; padding: 12px 25px; background-color: #6366f1; color: white; text-decoration: none; border-radius: 5px; font-size: 16px; font-weight: bold;"
            >
              Create My Resume Now
            </a>
          </div>
          <p style="font-size: 13px; color: #555;">Your dream job is one resume away. Let's get started!</p>
          <p style="margin-top: 20px; font-size: 12px; color: #888; text-align: center;">
            &mdash; The ${process.env.FROM_NAME} Team
          </p>
        </div>
      `,
    });
    console.log(`Reminder email sent to ${userEmail}`);
    return info;
  } catch (error) {
    console.error(`Failed to send reminder email to ${userEmail}. Error: ${error.message}`);
    throw new Error('Could not send the reminder email.');
  }
};

/**
 * Sends an email with the Google Drive link after a resume PDF is downloaded.
 */
export const sendDriveLinkEmail = async (userName, userEmail, resumeTitle, driveLink) => {
  try {
    const info = await sendEmail({
      to: [{ email: userEmail, name: userName }],
      subject: `Your resume "${resumeTitle}" is ready — here's your Drive link`,
      htmlContent: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
          <h1 style="color: #6366f1; text-align: center;">Your Resume is Ready!</h1>
          <p>Hi ${userName},</p>
          <p>You just downloaded <strong>${resumeTitle}</strong>. We've also saved a copy to Google Drive so you can access it anytime.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a
              href="${driveLink}"
              style="display: inline-block; padding: 12px 25px; background-color: #10b981; color: white; text-decoration: none; border-radius: 5px; font-size: 16px; font-weight: bold;"
            >
              Open in Google Drive
            </a>
          </div>
          <p style="font-size: 13px; color: #555;">You can share this link or use it to view your resume on any device.</p>
          <p style="font-size: 12px; word-break: break-all; color: #666;">${driveLink}</p>
          <p style="margin-top: 20px; font-size: 12px; color: #888; text-align: center;">
            Good luck with your job search!<br>
            &mdash; The ${process.env.FROM_NAME} Team
          </p>
        </div>
      `,
    });
    console.log(`Drive link email sent to ${userEmail} for resume "${resumeTitle}"`);
    return info;
  } catch (error) {
    console.error(`Failed to send drive link email to ${userEmail}. Error: ${error.message}`);
    throw new Error('Could not send the drive link email.');
  }
};

/**
 * Sends a password reset email.
 */
export const sendPasswordResetEmail = async (userName, userEmail, resetLink) => {
  try {
    const info = await sendEmail({
      to: [{ email: userEmail, name: userName }],
      subject: "Password Reset Request – NxtResume",
      htmlContent: `
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
    });
    console.log(`Password reset email sent to ${userEmail}`);
    return info;
  } catch (error) {
    console.error(`Failed to send password reset email to ${userEmail}. Error: ${error.message}`);
    throw new Error('Could not send the password reset email.');
  }
};
