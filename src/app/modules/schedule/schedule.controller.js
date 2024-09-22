import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync.js";
import sendResponse from "../../../shared/sendResponse.js";
import { scheduleService } from "./schedule.service.js";

const createSchedule = catchAsync(async (req, res, next) => {
  try {
    const result = await scheduleService.createSchedule(req.body);
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "schedule created successfully!",
      data: result,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
});
const getAllSchedule = catchAsync(async (req, res, next) => {
  try {
    const result = await scheduleService.getAllSchedules();
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "schedules fetched successfully!",
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

const getSingleScheculeById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  try {
    const result = await scheduleService.getSingleScheduleById(id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "schedule fetched successfully!",
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

const updateSchedule = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  try {
    const result = await scheduleService.updateSchedule(id, req.body);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "schedule updated successfully!",
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

const deleteSchedule = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  try {
    const result = await scheduleService.deleteSchedule(id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "schedule fetched successfully!",
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

const clearSchedule = catchAsync(async (req, res, next) => {
  try {
    const result = await scheduleService.clear()
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "schedule cleard successfully from redis!",
      data: result,
    });
  } catch (error) {
    console.error(error)
    next(error);
  }
});

export const scheduleController = {
  getAllSchedule,
  getSingleScheculeById,
  updateSchedule,
  deleteSchedule,
  createSchedule,
  clearSchedule
};
