import express from "express";
import { UserRoutes } from "../modules/user/user.route.js";
import { ScheduleRoutes } from "../modules/schedule/schedule.route.js";
const router = express.Router();
const routes = [
  {
    path: "/users",
    route: UserRoutes,
  },
  {
    path: "/schedules",
    route: ScheduleRoutes,
  },
];

routes.forEach((route) => router.use(route.path, route.route));
export default router;
