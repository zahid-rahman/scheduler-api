import { model, Schema } from "mongoose";

const scheduleSchema = new Schema(
  {
    title: {
      type: String,
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: [true, "user is required"],
      ref: "User",
    },
    sendTo: {
      type: String,
    },
    phone: {
      type: String,
    },
    description: {
      type: String,
    },
    type: {
      type: String,
    },
    startDate: {
      type: String,
    },
    startTime: {
      type: String,
    },
    endDate: {
      type: String,
    },
    endTime: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);
export const Schedule = model("Schedule", scheduleSchema);
