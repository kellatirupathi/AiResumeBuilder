import "../models/user.model.js";
import CoverLetter from "../models/coverLetter.model.js";
import { generateCoverLetterPDF } from "./coverLetterPdf.service.js";
import { uploadOrUpdatePdf } from "./drive.service.js";

const pendingDriveLinkQuery = {
  $or: [
    { googleDriveLink: { $exists: false } },
    { googleDriveLink: null },
    { googleDriveLink: "" },
    { driveOutOfSync: true },
  ],
};

export const generateAndUploadCoverLetterDriveLink = async (coverLetter) => {
  await coverLetter.populate("user", "fullName");

  const userFullName = coverLetter.user?.fullName;
  if (!userFullName) {
    throw new Error(
      `Missing user name for cover letter ${coverLetter._id}`
    );
  }

  const pdfBuffer = await generateCoverLetterPDF(coverLetter.toObject());
  const { fileId, webViewLink } = await uploadOrUpdatePdf(
    `cl_${coverLetter._id.toString()}`,
    `${userFullName}_CoverLetter`,
    pdfBuffer,
    coverLetter.googleDriveFileId
  );

  await CoverLetter.updateOne(
    { _id: coverLetter._id },
    {
      $set: {
        googleDriveFileId: fileId,
        googleDriveLink: webViewLink,
        driveOutOfSync: false,
      },
    }
  );

  return { fileId, webViewLink };
};

export const processPendingCoverLetterDriveLinks = async () => {
  const items = await CoverLetter.find(pendingDriveLinkQuery).populate(
    "user",
    "fullName"
  );

  const summary = {
    attempted: items.length,
    processed: 0,
    failed: 0,
    skipped: 0,
    failedIds: [],
  };

  for (const item of items) {
    if (!item.user?.fullName) {
      summary.skipped += 1;
      summary.failedIds.push(item._id.toString());
      continue;
    }

    try {
      await generateAndUploadCoverLetterDriveLink(item);
      summary.processed += 1;
    } catch (error) {
      console.error(
        `Failed to process Drive link for cover letter ${item._id}:`,
        error
      );
      summary.failed += 1;
      summary.failedIds.push(item._id.toString());
    }
  }

  return summary;
};
