import { UserController } from "../controllers/user.controller";

import express from "express";
const router = express.Router();

router.post("/sign-up", UserController.newUser);
router.post("/log-in", UserController.logUserIn);

export default router;
