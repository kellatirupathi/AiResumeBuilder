import Resume from "../models/resume.model.js";
import { generatePDF } from "./pdf.service.js";
import { uploadOrUpdatePdf } from "./drive.service.js";

const pendingDriveLinkQuery = {
  $or: [
    { googleDriveLink: { $exists: false } },
    { googleDriveLink: null },
    { googleDriveLink: "" },
  ],
};

export const generateAndUploadResumeDriveLink = async (resume) => {
  await resume.populate("user", "fullName");

  const userFullName = resume.user?.fullName;
  if (!userFullName) {
    throw new Error(`Missing user name for resume ${resume._id}`);
  }

  const pdfBuffer = await generatePDF(resume.toObject());
  const { fileId, webViewLink } = await uploadOrUpdatePdf(
    resume._id.toString(),
    userFullName,
    pdfBuffer,
    resume.googleDriveFileId
  );

  await Resume.updateOne(
    { _id: resume._id },
    {
      $set: {
        googleDriveFileId: fileId,
        googleDriveLink: webViewLink,
      },
    }
  );

  return { fileId, webViewLink };
};

export const processPendingResumeDriveLinks = async () => {
  const resumesToProcess = await Resume.find(pendingDriveLinkQuery).populate(
    "user",
    "fullName"
  );

  const summary = {
    attempted: resumesToProcess.length,
    processed: 0,
    failed: 0,
    skipped: 0,
    failedResumeIds: [],
  };

  for (const resume of resumesToProcess) {
    if (!resume.user?.fullName) {
      summary.skipped += 1;
      summary.failedResumeIds.push(resume._id.toString());
      continue;
    }

    try {
      await generateAndUploadResumeDriveLink(resume);
      summary.processed += 1;
    } catch (error) {
      console.error(
        `Failed to process Drive link for resume ${resume._id}:`,
        error
      );
      summary.failed += 1;
      summary.failedResumeIds.push(resume._id.toString());
    }
  }

  return summary;
};
