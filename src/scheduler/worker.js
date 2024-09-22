import { Queue, Worker } from "bullmq";
import { errorlogger } from "../shared/logger.js";
import { RedisClient } from "../shared/redis.js";
import emailHelper from "../helper/email.helper.js";
export const eventSchedulerQueue = new Queue("schedule_event", {
  connection: RedisClient.redisClient,
});

const eventSchedulerWorker = new Worker(
  "schedule_event",
  async (job) => {
    try {
      console.log("***** PROCESSING ******");
      console.log(`Processing job ${job.id} - ${job.name}`);
      await emailHelper.sendEmail(
        {
          to: job.data.email,
          subject: job.data.title,
          text: job.data.text,
          html: job.data.html,
        },
        (error) => {
          console.error(error);
        }
      );
    } catch (error) {
      console.error(`Error processing job ${job.id}`);
      throw error;
    }
  },
  { connection: RedisClient.redisClient }
);

eventSchedulerWorker.on("completed", async (job) => {
  console.log(`Job ${job.id} completed.`);
});

eventSchedulerWorker.on("failed", (job, err) => {
  console.error("** ERROR **", err);
  console.error(`Job ${job.id} failed with error: ${err.message}`);
});
