import ApiError from "../../../errors/ApiError.js";
import { paginationHelpers } from "../../../helper/pagination.helper.js";
import { userSearchableFields } from "./user.constant.js";
import { User } from "./user.model.js";

async function getAllUsers(filters, paginationOptions) {
  const { searchTerm, ...filterData } = filters;
  const andConditions = [];
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);
  if (searchTerm) {
    andConditions.push({
      $or: userSearchableFields.map((field) => ({
        [field]: {
          $regex: searchTerm,
          $options: "i",
        },
      })),
    });
  }

  if (Object.keys(filterData).length) {
    andConditions.push({
      $and: Object.entries(filterData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  const sortConditions = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }
  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const result = await User.find(whereConditions)
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await User.countDocuments();
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
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
