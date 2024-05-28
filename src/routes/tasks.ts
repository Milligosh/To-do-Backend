import express from "express";
const router = express.Router();
import { TaskController } from "../controllers/tasks.controller";
import authenticateToken from "../middlewares/auth.middleware";

router.post("/new", authenticateToken, TaskController.createNewTask);
router.get("/all", authenticateToken, TaskController.fetchingAll);
router.delete("/delete/:id", authenticateToken, TaskController.deletefromDB);
router.put("/update/:id", authenticateToken, TaskController.editDetails);
export default router;
