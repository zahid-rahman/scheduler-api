import express from "express";
import { userController } from "./user.controller.js";
const router = express.Router();

router.get("/", userController.getAllUsers);
router.post("/", userController.createUser);
router.get("/:id", userController.getSingleUserById);
router.patch('/:id', userController.updateUser);
router.delete("/:id", userController.deleteUser)

export const UserRoutes = router;
