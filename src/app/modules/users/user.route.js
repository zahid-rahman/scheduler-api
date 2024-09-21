import express from "express";
import { userController } from "./user.controller.js";
const router = express.Router();

/**
 * @swagger
 * /api/v1/users:
 *   get:
 *     summary: Retrieve a list of users
 *     tags:
 *       - User
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   name:
 *                     type: string
 *                     example: John Doe
 */
router.get("/", userController.getAllUsers);
router.post("/", userController.createUser);
router.get("/:id", userController.getSingleUserById);
router.patch("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

export const UserRoutes = router;
