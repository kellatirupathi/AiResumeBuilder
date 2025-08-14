// C:\Users\NxtWave\Downloads\code\Backend\scripts\backfillDriveLinks.js

import mongoose from 'mongoose';
import { config } from 'dotenv';
import Resume from '../src/models/resume.model.js';
import User from '../src/models/user.model.js';
import { generatePDF } from '../src/services/pdf.service.js';
import { uploadOrUpdatePdf } from '../src/services/drive.service.js';

// Load environment variables from .env file
config({ path: './.env' });

// Function to connect to the database
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      dbName: 'ai_resume_builder',
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (err) {
    console.error('Database connection failed:', err);
    process.exit(1);
  }
};

// The main backfill function
const backfillDriveLinks = async () => {
  console.log('Starting backfill process for Google Drive links...');
  
  await connectDB();
  
  // Find all resumes that DO NOT have a googleDriveLink
  const resumesToUpdate = await Resume.find({ 
    $or: [
      { googleDriveLink: { $exists: false } },
      { googleDriveLink: null },
      { googleDriveLink: '' }
    ]
  }).populate('user', 'fullName');

  if (resumesToUpdate.length === 0) {
    console.log('All resumes already have Google Drive links. Nothing to do.');
    process.exit(0);
  }

  console.log(`Found ${resumesToUpdate.length} resumes to process.`);
  let successCount = 0;
  let errorCount = 0;

  for (const resume of resumesToUpdate) {
    try {
      const userFullName = resume.user?.fullName;
      if (!userFullName) {
        console.warn(`Skipping resume ID ${resume._id} due to missing user name.`);
        continue;
      }
      
      console.log(`Processing resume ID: ${resume._id} for user: ${userFullName}`);
      
      // 1. Generate PDF buffer
      const pdfBuffer = await generatePDF(resume.toObject());
      
      // 2. Upload/update the PDF to Google Drive
      const { fileId, webViewLink } = await uploadOrUpdatePdf(
        resume._id.toString(),
        userFullName,
        pdfBuffer,
        resume.googleDriveFileId // Pass existing ID just in case
      );

      // --- START OF FIX ---
      // 3. Update the document directly in the DB instead of using resume.save()
      // This bypasses validation on other fields like the broken certification entry.
      await Resume.updateOne(
        { _id: resume._id },
        { 
          $set: { 
            googleDriveFileId: fileId, 
            googleDriveLink: webViewLink 
          } 
        }
      );
      // --- END OF FIX ---

      console.log(`  -> Successfully updated resume ID: ${resume._id}. New Link: ${webViewLink}`);
      successCount++;
      
      // Add a small delay to avoid hitting API rate limits if you have thousands of resumes
      await new Promise(resolve => setTimeout(resolve, 500)); // 0.5 second delay

    } catch (error) {
      console.error(`  -> Failed to process resume ID: ${resume._id}. Error: ${error.message}`);
      errorCount++;
    }
  }
  
  console.log('\n--- Backfill Process Complete ---');
  console.log(`Successfully processed: ${successCount}`);
  console.log(`Failed to process: ${errorCount}`);
  
  process.exit(0);
};

// Run the script
backfillDriveLinks();
