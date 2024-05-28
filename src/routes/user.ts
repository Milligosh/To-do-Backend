import { UserController } from "../Controllers/user.controller";

import express from "express";
const router = express.Router();

router.post("/newUser", UserController.newUser);
router.post(
  "/logIn",  UserController.logUserIn
);

export default router;
