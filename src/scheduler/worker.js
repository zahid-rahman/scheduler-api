import { Queue } from "bullmq";
import { errorlogger } from "../shared/logger";

export const eventSchedulerQueue = new Queue("schedule_event");

const eventSchedulerWorker = new Worker("schedule_event", async (job) => {
  try {
    console.log(`Processing job ${job.id} - ${job.name}`);
  } catch (error) {
    errorlogger.error(`Error processing job ${job.id}`);
    throw error;
  }
});

eventSchedulerWorker.on("completed", async (job) => {
  console.log(`Job ${job.id} completed.`);
});
