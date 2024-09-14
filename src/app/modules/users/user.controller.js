import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync.js";
import sendResponse from "../../../shared/sendResponse.js";
import { userService } from "./user.service.js";

const createUser = catchAsync(async (req, res, next) => {
  try {
    const result = await userService.createUser(req.body);
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
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "users fetched successfully!",
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

const getSingleUserById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  try {
    const result = await userService.getSingleUserById(id);
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
  deleteUser
};
