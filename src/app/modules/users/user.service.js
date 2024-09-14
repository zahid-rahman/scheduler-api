import ApiError from "../../../errors/ApiError.js";
import { User } from "./user.model.js";

async function getAllUsers() {
  const result = await User.find({});
  return result;
}

async function createUser(body) {
  const createdUser = await User.create(body);
  if (!createdUser) {
    throw new ApiError(400, "Failed to create user");
  }
  return createdUser;
}
async function getSingleUserById(id) {
  return await User.findById(id);
}

async function updateUser(id, body) {
  return await User.findOneAndUpdate({ _id: id }, body, {
    new: true,
  });
}

async function deleteUser(id) {
  return await User.findByIdAndDelete(id);
}

export const userService = {
  getAllUsers,
  createUser,
  getSingleUserById,
  updateUser,
  deleteUser,
};
