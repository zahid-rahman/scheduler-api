import express from "express";
import { scheduleController } from "./schedule.controller.js";
const router = express.Router();

/**
 * @swagger
 * /api/v1/schedules:
 *   get:
 *     summary: Retrieve a list of users
 *     tags:
 *       - Schedule
 */
router.get("/", scheduleController.getAllSchedule);
router.post("/", scheduleController.createSchedule);
router.get("/:id", scheduleController.getSingleScheculeById);
router.patch("/:id", scheduleController.updateSchedule);
router.delete("/:id", scheduleController.deleteSchedule);
router.post('/clear', scheduleController.clearSchedule)

export const ScheduleRoutes = router;
