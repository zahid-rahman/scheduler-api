import { model, Schema } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
      unique: true,
    },
    address: {
      type: String,
    },
    pass: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);
export const User = model("User", userSchema);
