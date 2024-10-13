import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync.js";
import sendResponse from "../../../shared/sendResponse.js";
import { userService } from "./user.service.js";
import { RedisClient } from "../../../shared/redis.js";
const redis = RedisClient.redisClient;
const createUser = catchAsync(async (req, res, next) => {
  try {
    const result = await userService.createUser(req.body);
    // Clear the cached users data in Redis
    await redis.del("users");
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "user created successfully!",
      data: result,
    });
  } catch (error) {
    next(error);
  }
});
const getAllUsers = catchAsync(async (req, res, next) => {
  try {
    const result = await userService.getAllUsers();
    /**
     * fetching the cache data
     */
    const cachedRecord = await redis.get("users");
    console.log("cached data:", cachedRecord);
    if (cachedRecord) {
      return sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "users fetched successfully!",
        data: JSON.parse(cachedRecord),
      });
    }
    /** store the data if not cached in redis */
    await redis.set("users", JSON.stringify(result), "EX", 120, "NX");

    /** this is only for learning purpose to delay the request. It can be the execution time of the query */
    const delay = 1000;
    return new Promise((resolve) => {
      setTimeout(async () => {
        sendResponse(res, {
          statusCode: httpStatus.OK,
          success: true,
          message: "users fetched successfully!",
          data: result,
        });
        /**
         * storing information in redis for caching
         */
        resolve(result);
      }, delay);
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

const getSingleUserById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  try {
    const result = await userService.getSingleUserById(id);
    const cachedRecord = await redis.get(`user-${id}`);

    if (cachedRecord) {
      sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "user fetched successfully!",
        data: JSON.parse(cachedRecord),
      });
    }

    /** store the data if not cached in redis */
    await redis.set(`user-${id}`, JSON.stringify(result), "EX", 120, "NX");
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "user fetched successfully!",
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

const updateUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  try {
    const result = await userService.updateUser(id, req.body);
    // Clear the cached users data in Redis
    await redis.del(`user-${id}`);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "user fetched successfully!",
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

const deleteUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  try {
    const result = await userService.deleteUser(id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "user fetched successfully!",
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

export const userController = {
  getAllUsers,
  createUser,
  getSingleUserById,
  updateUser,
  deleteUser,
};
