import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync.js";
import sendResponse from "../../../shared/sendResponse.js";
import { userService } from "./user.service.js";
import { RedisClient } from "../../../shared/redis.js";
import sanitize, { areObjectsEqual } from "../../../shared/sanitize.js";
import { paginationFields } from "../../../constant/pagination.js";
import { userSearchableFields } from "./user.constant.js";
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
    const filters = sanitize(req.query, userSearchableFields);
    const paginationOptions = sanitize(req.query, paginationFields);
    const result = await userService.getAllUsers(filters, paginationOptions);
    const cachedFilters = await redis.get("user:filter");
    const isFound = areObjectsEqual(
      filters,
      cachedFilters === null ? {} : JSON.parse(cachedFilters)
    );

    if (!isFound) {
      /** if filter options changes then invalidate cache data */
      await redis.del("users");
      await redis.del("user:filter");
    }

    /**
     * fetching the cache data
     */
    const cachedRecord = await redis.get("users");
    // console.log("cached data:", cachedRecord);
    if (cachedRecord) {
      return sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "users fetched successfully!",
        meta: JSON.parse(cachedRecord).meta,
        data: JSON.parse(cachedRecord).data,
      });
    }

    /** store the data if not cached in redis */
    await redis.set("user:filter", JSON.stringify(filters), "EX", 120, "NX");
    await redis.set("users", JSON.stringify(result), "EX", 120, "NX");

    /** this is only for learning purpose to delay the request. It can be the execution time of the query */
    const delay = 1000;
    return new Promise((resolve) => {
      setTimeout(async () => {
        sendResponse(res, {
          statusCode: httpStatus.OK,
          success: true,
          message: "users fetched successfully!",
          meta: result.meta,
          data: result.data,
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
