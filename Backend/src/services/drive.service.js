// // C:\Users\NxtWave\Downloads\code\Backend\src\services\drive.service.js

// import { google } from 'googleapis';
// import { Readable } from 'stream';

// const SCOPES = ['https://www.googleapis.com/auth/drive'];

// const auth = new google.auth.GoogleAuth({
//   keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
//   scopes: SCOPES,
// });

// const drive = google.drive({ version: 'v3', auth });

// /**
//  * Uploads a new PDF or updates an existing one in Google Drive.
//  * @param {string} resumeId - The ID of the resume for naming the file.
//  * @param {string} userFullName - The full name of the user for the filename.
//  * @param {Buffer} pdfBuffer - The PDF content as a buffer.
//  * @param {string | null} existingFileId - The Google Drive file ID if it exists.
//  * @returns {Promise<{fileId: string, webViewLink: string}>} - The new file ID and public link.
//  */
// // MODIFIED: Added userFullName to the function signature
// export const uploadOrUpdatePdf = async (resumeId, userFullName, pdfBuffer, existingFileId) => {
//   const FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID;

//   if (!FOLDER_ID) {
//     throw new Error("GOOGLE_DRIVE_FOLDER_ID is not set in the environment variables.");
//   }
  
//   const bufferStream = new Readable();
//   bufferStream.push(pdfBuffer);
//   bufferStream.push(null);

//   const safeFullName = (userFullName || "User").replace(/[^a-zA-Z0-9\s]/g, '');

//   const fileMetadata = {
//     // MODIFIED: Changed the filename structure
//     name: `${safeFullName}_${resumeId}.pdf`,
//     mimeType: 'application/pdf',
//   };

//   const media = {
//     mimeType: 'application/pdf',
//     body: bufferStream,
//   };
  
//   let file;

//   try {
//     if (existingFileId) {
//       // File exists, update it
//       console.log(`Updating existing Google Drive file: ${existingFileId}`);
//       const response = await drive.files.update({
//         fileId: existingFileId,
//         media: media,
//         requestBody: fileMetadata,
//         fields: 'id, webViewLink',
//         supportsAllDrives: true,
//       });
//       file = response.data;
//     } else {
//       // File does not exist, create a new one
//       console.log(`Creating new Google Drive file for resume: ${resumeId}`);
//       const response = await drive.files.create({
//         requestBody: { ...fileMetadata, parents: [FOLDER_ID] },
//         media: media,
//         fields: 'id, webViewLink',
//         supportsAllDrives: true,
//       });
//       file = response.data;
      
//       // Make the new file publically readable
//       await drive.permissions.create({
//         fileId: file.id,
//         requestBody: {
//           role: 'reader',
//           type: 'anyone',
//         },
//         supportsAllDrives: true,
//       });
//     }
    
//     console.log(`Successfully processed file. File ID: ${file.id}`);
//     return { fileId: file.id, webViewLink: file.webViewLink };
    
//   } catch (error) {
//       console.error("Error during Google Drive operation:", error);
//       throw new Error("Failed to upload/update PDF on Google Drive.");
//   }
// };



// C:\Users\NxtWave\Downloads\code\Backend\src\services\drive.service.js

import { google } from 'googleapis';
import { Readable } from 'stream';

// --- SECURE AUTHENTICATION SETUP ---

const SCOPES = ['https://www.googleapis.com/auth/drive'];
let auth;

// 1. PRODUCTION (RENDER) - Checks for the Base64 encoded credentials
if (process.env.GOOGLE_CREDENTIALS_BASE64) {
  try {
    // Decode the base64 string from the environment variable into a JSON string
    const credentialsJson = Buffer.from(process.env.GOOGLE_CREDENTIALS_BASE64, 'base64').toString('utf8');
    const credentials = JSON.parse(credentialsJson);
    
    // Authenticate directly with the credentials object
    auth = new google.auth.GoogleAuth({
      credentials,
      scopes: SCOPES,
    });
    console.log("Authenticated with Google Drive using Base64 credentials (Production).");
  } catch (error) {
    console.error("CRITICAL: Failed to parse GOOGLE_CREDENTIALS_BASE64 environment variable:", error);
    // This will stop the server from starting if credentials are misconfigured in production
    throw new Error("Invalid Google credentials provided in environment variable.");
  }
} 
// 2. LOCAL DEVELOPMENT - Falls back to the local file path
else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  auth = new google.auth.GoogleAuth({
    keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    scopes: SCOPES,
  });
  console.log("Authenticated with Google Drive using local key file (Development).");
} 
// 3. ERROR - If no credentials are found
else {
  console.error("CRITICAL: Google Drive credentials are not configured.");
  // This will stop the server from starting if credentials are not found
  throw new Error('Google Drive credentials must be set with either GOOGLE_CREDENTIALS_BASE64 (for production) or GOOGLE_APPLICATION_CREDENTIALS (for local .env).');
}

// Initialize the Google Drive service
const drive = google.drive({ version: 'v3', auth });

/**
 * Uploads a new PDF or updates an existing one in Google Drive.
 * @param {string} resumeId - The ID of the resume for naming the file.
 * @param {string} userFullName - The full name of the user for the filename.
 * @param {Buffer} pdfBuffer - The PDF content as a buffer.
 * @param {string | null} existingFileId - The Google Drive file ID if it exists.
 * @returns {Promise<{fileId: string, webViewLink: string}>} - The new file ID and public link.
 */
export const uploadOrUpdatePdf = async (resumeId, userFullName, pdfBuffer, existingFileId) => {
  const FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID;

  if (!FOLDER_ID) {
    throw new Error("CRITICAL: GOOGLE_DRIVE_FOLDER_ID is not set in the environment variables.");
  }
  
  // Convert the PDF buffer into a readable stream for upload
  const bufferStream = new Readable();
  bufferStream.push(pdfBuffer);
  bufferStream.push(null);

  // Sanitize user name to be safe for a filename
  const safeFullName = (userFullName || "User").replace(/[^a-zA-Z0-9\s]/g, '');

  const fileMetadata = {
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
      // If a file ID is provided, update the existing file
      console.log(`Updating existing Google Drive file: ${existingFileId}`);
      const response = await drive.files.update({
        fileId: existingFileId,
        media: media,
        requestBody: fileMetadata, // Only updating the name
        fields: 'id, webViewLink',
        supportsAllDrives: true,
      });
      file = response.data;
    } else {
      // If no file ID, create a new file inside the specified folder
      console.log(`Creating new Google Drive file for resume: ${resumeId}`);
      const response = await drive.files.create({
        requestBody: { ...fileMetadata, parents: [FOLDER_ID] },
        media: media,
        fields: 'id, webViewLink',
        supportsAllDrives: true,
      });
      file = response.data;
      
      // Make the new file publicly readable so anyone with the link can view it
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
