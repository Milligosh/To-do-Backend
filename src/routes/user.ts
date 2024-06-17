import { UserController } from "../controllers/user.controller";

const {
  validateSignUpApplicantInput,
} = require("../middlewares/validation.middleware");
import express from "express";
const router = express.Router();

router.post("/sign-up", validateSignUpApplicantInput, UserController.newUser);
router.post("/log-in", UserController.logUserIn);

export default router;
