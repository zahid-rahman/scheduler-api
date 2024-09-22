import ApiError from "../../../errors/ApiError.js";
import { eventSchedulerQueue } from "../../../scheduler/worker.js";
import { RedisClient } from "../../../shared/redis.js";
import { Schedule } from "./schedule.model.js";
async function getAllSchedules() {
  const result = await Schedule.find({});
  return result;
}

async function createSchedule(body) {
  const createdSchedule = await Schedule.create(body);
  if (!createdSchedule) {
    throw new ApiError(400, "Failed to create schedule");
  }

  const { startDate, startTime } = body;
  const scheduledDateTime = new Date(`${startDate}T${startTime}`);
  const currentDate = new Date();
  const delayInMilliseconds = scheduledDateTime - currentDate;
  if (delayInMilliseconds < 0) {
    throw new ApiError(400, "Scheduled time must be in the future");
  }

  await eventSchedulerQueue.add(
    `event_schedule_${createdSchedule._id}`,
    {
      scheduleId: createdSchedule._id,
      title: createdSchedule.title,
      email: createdSchedule.sendTo,
      text: createdSchedule.title,
      html: `
          <h1>Welcome to meeting</h1> <br />
          <p>${createdSchedule.description}</p>
      `,
    },
    {
      delay: delayInMilliseconds,
    }
  );

  return createdSchedule;
}

async function getSingleScheduleById(id) {
  return await Schedule.findById(id);
}

async function updateSchedule(id, body) {
  return await Schedule.findOneAndUpdate({ _id: id }, body, {
    new: true,
  });
}

async function deleteSchedule(id) {
  return await Schedule.findByIdAndDelete(id);
}

async function clear() {
  try {
    await RedisClient.redisClient.flushall();
    await Schedule.deleteMany({});
  } catch (error) {
    console.log(error);
  }

  await Schedule.deleteMany();
  return null;
}

export const scheduleService = {
  getAllSchedules,
  getSingleScheduleById,
  createSchedule,
  deleteSchedule,
  updateSchedule,
  clear,
};
