// C:\Users\NxtWave\Downloads\code\Backend\src\services\drive.service.js

import { google } from 'googleapis';
import { Readable } from 'stream';

const SCOPES = ['https://www.googleapis.com/auth/drive'];

const auth = new google.auth.GoogleAuth({
  keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  scopes: SCOPES,
});

const drive = google.drive({ version: 'v3', auth });

/**
 * Uploads a new PDF or updates an existing one in Google Drive.
 * @param {string} resumeId - The ID of the resume for naming the file.
 * @param {string} userFullName - The full name of the user for the filename.
 * @param {Buffer} pdfBuffer - The PDF content as a buffer.
 * @param {string | null} existingFileId - The Google Drive file ID if it exists.
 * @returns {Promise<{fileId: string, webViewLink: string}>} - The new file ID and public link.
 */
// MODIFIED: Added userFullName to the function signature
export const uploadOrUpdatePdf = async (resumeId, userFullName, pdfBuffer, existingFileId) => {
  const FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID;

  if (!FOLDER_ID) {
    throw new Error("GOOGLE_DRIVE_FOLDER_ID is not set in the environment variables.");
  }
  
  const bufferStream = new Readable();
  bufferStream.push(pdfBuffer);
  bufferStream.push(null);

  const safeFullName = (userFullName || "User").replace(/[^a-zA-Z0-9\s]/g, '');

  const fileMetadata = {
    // MODIFIED: Changed the filename structure
    name: `${safeFullName}_${resumeId}.pdf`,
    mimeType: 'application/pdf',
  };

  const media = {
    mimeType: 'application/pdf',
    body: bufferStream,
  };
  
  let file;

  try {
    if (existingFileId) {
      // File exists, update it
      console.log(`Updating existing Google Drive file: ${existingFileId}`);
      const response = await drive.files.update({
        fileId: existingFileId,
        media: media,
        requestBody: fileMetadata,
        fields: 'id, webViewLink',
        supportsAllDrives: true,
      });
      file = response.data;
    } else {
      // File does not exist, create a new one
      console.log(`Creating new Google Drive file for resume: ${resumeId}`);
      const response = await drive.files.create({
        requestBody: { ...fileMetadata, parents: [FOLDER_ID] },
        media: media,
        fields: 'id, webViewLink',
        supportsAllDrives: true,
      });
      file = response.data;
      
      // Make the new file publically readable
      await drive.permissions.create({
        fileId: file.id,
        requestBody: {
          role: 'reader',
          type: 'anyone',
        },
        supportsAllDrives: true,
      });
    }
    
    console.log(`Successfully processed file. File ID: ${file.id}`);
    return { fileId: file.id, webViewLink: file.webViewLink };
    
  } catch (error) {
      console.error("Error during Google Drive operation:", error);
      throw new Error("Failed to upload/update PDF on Google Drive.");
  }
};
