import { UserController } from "../Controllers/user.controller";

import express from "express";
const router = express.Router();

router.post("/newUser", UserController.newUser);
router.post(
  "/logIn",  UserController.logUserIn
);

// router.get("/", UserController.fetchingAll);
// router.patch("/update/:id", UserController.editDetails);
// router.delete("/delete/:id", UserController.deletefromDB);

export default router;
