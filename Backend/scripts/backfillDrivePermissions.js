// Backend/scripts/backfillDrivePermissions.js
//
// Re-applies "Anyone with the link — Viewer" permission to every file in the
// configured Google Drive folder (GOOGLE_DRIVE_FOLDER_ID). Use this when
// someone revoked public sharing on existing uploaded PDFs and the app's
// share links start returning "You need access".
//
// Run with:   npm run drive:backfill-permissions

import { google } from "googleapis";
import { config } from "dotenv";

config({ path: "./.env" });

const SCOPES = ["https://www.googleapis.com/auth/drive"];

// --- Auth (same pattern as drive.service.js) ---
let auth;
if (process.env.GOOGLE_CREDENTIALS_BASE64) {
  const credentialsJson = Buffer.from(
    process.env.GOOGLE_CREDENTIALS_BASE64,
    "base64"
  ).toString("utf8");
  const credentials = JSON.parse(credentialsJson);
  auth = new google.auth.GoogleAuth({ credentials, scopes: SCOPES });
  console.log("Authenticated with Google Drive using Base64 credentials.");
} else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  auth = new google.auth.GoogleAuth({
    keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    scopes: SCOPES,
  });
  console.log("Authenticated with Google Drive using local key file.");
} else {
  console.error(
    "CRITICAL: Google Drive credentials are not configured (set GOOGLE_CREDENTIALS_BASE64 or GOOGLE_APPLICATION_CREDENTIALS in .env)."
  );
  process.exit(1);
}

const drive = google.drive({ version: "v3", auth });
const FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID;

if (!FOLDER_ID) {
  console.error(
    "CRITICAL: GOOGLE_DRIVE_FOLDER_ID is not set in the environment variables."
  );
  process.exit(1);
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// --- List every file in the folder (paginated) ---
const listAllFiles = async () => {
  const files = [];
  let pageToken = null;

  do {
    const res = await drive.files.list({
      q: `'${FOLDER_ID}' in parents and trashed = false`,
      corpora: "allDrives",
      includeItemsFromAllDrives: true,
      supportsAllDrives: true,
      pageSize: 1000,
      fields: "nextPageToken, files(id, name, mimeType)",
      pageToken: pageToken || undefined,
    });
    files.push(...(res.data.files || []));
    pageToken = res.data.nextPageToken || null;
  } while (pageToken);

  return files;
};

// --- Check if file already has "anyone" permission ---
const hasAnyonePermission = async (fileId) => {
  try {
    const res = await drive.permissions.list({
      fileId,
      supportsAllDrives: true,
      fields: "permissions(id, type, role)",
    });
    return (res.data.permissions || []).some(
      (p) => p.type === "anyone" && (p.role === "reader" || p.role === "writer")
    );
  } catch {
    return false;
  }
};

// --- Apply "anyone / reader" permission ---
const addAnyonePermission = async (fileId) => {
  await drive.permissions.create({
    fileId,
    requestBody: { role: "reader", type: "anyone" },
    supportsAllDrives: true,
  });
};

// --- Main ---
const main = async () => {
  console.log(`\nBackfilling Drive permissions for folder ${FOLDER_ID}...\n`);

  let files;
  try {
    files = await listAllFiles();
  } catch (err) {
    console.error("Failed to list files:", err.message);
    console.error(
      "\nMost common cause: the service account is not a member of the Shared Drive, or the folder ID is wrong."
    );
    process.exit(1);
  }

  if (!files.length) {
    console.log("No files found in the folder. Nothing to backfill.");
    return;
  }

  console.log(`Found ${files.length} file(s). Processing...\n`);

  const summary = {
    total: files.length,
    alreadyPublic: 0,
    fixed: 0,
    failed: 0,
    failures: [],
  };

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const progress = `[${i + 1}/${files.length}]`;

    try {
      const already = await hasAnyonePermission(file.id);
      if (already) {
        summary.alreadyPublic += 1;
        console.log(`${progress} ✓ ${file.name} — already public, skipped`);
      } else {
        await addAnyonePermission(file.id);
        summary.fixed += 1;
        console.log(`${progress} ✔ ${file.name} — permission applied`);
      }
    } catch (err) {
      summary.failed += 1;
      summary.failures.push({ id: file.id, name: file.name, error: err.message });
      console.error(`${progress} ✗ ${file.name} — ${err.message}`);
    }

    // Be nice to Google's rate limit (100 req/100s/user for drive)
    if ((i + 1) % 20 === 0) {
      await sleep(500);
    }
  }

  console.log("\n─── Summary ───");
  console.log(`Total files:       ${summary.total}`);
  console.log(`Already public:    ${summary.alreadyPublic}`);
  console.log(`Permission fixed:  ${summary.fixed}`);
  console.log(`Failed:            ${summary.failed}`);
  if (summary.failures.length) {
    console.log("\nFailed files:");
    summary.failures.forEach((f) => {
      console.log(`  - ${f.name} (${f.id}): ${f.error}`);
    });
  }
};

main()
  .then(() => {
    console.log("\nBackfill complete.");
    process.exit(0);
  })
  .catch((err) => {
    console.error("\nBackfill failed with unexpected error:", err);
    process.exit(1);
  });
