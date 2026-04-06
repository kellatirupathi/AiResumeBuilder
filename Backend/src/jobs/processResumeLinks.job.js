import mongoose from "mongoose";
import { config } from "dotenv";
import { connectDB } from "../db/index.js";
import { processPendingResumeDriveLinks } from "../services/resumeDrive.service.js";

config();

const run = async () => {
  try {
    await connectDB();

    const result = await processPendingResumeDriveLinks();

    console.log(
      JSON.stringify(
        {
          job: "process-resume-links",
          status: "completed",
          ...result,
        },
        null,
        2
      )
    );

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("process-resume-links job failed:", error);

    try {
      await mongoose.disconnect();
    } catch (disconnectError) {
      console.error(
        "process-resume-links job disconnect failed:",
        disconnectError
      );
    }

    process.exit(1);
  }
};

run();
