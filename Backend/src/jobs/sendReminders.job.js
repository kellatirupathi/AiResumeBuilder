import mongoose from "mongoose";
import { config } from "dotenv";
import { connectDB } from "../db/index.js";
import { processReminderNotifications } from "../services/reminder.service.js";

config();

const run = async () => {
  try {
    await connectDB();

    const result = await processReminderNotifications();

    console.log(
      JSON.stringify(
        {
          job: "send-reminders",
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
    console.error("send-reminders job failed:", error);

    try {
      await mongoose.disconnect();
    } catch (disconnectError) {
      console.error("send-reminders job disconnect failed:", disconnectError);
    }

    process.exit(1);
  }
};

run();
