import express from "express";
const router = express.Router();
import { TaskController } from "../Controllers/tasks.controller";
import authenticateToken from "../middlewares/auth.middleware";

router.post('/newTask',authenticateToken,TaskController.createNewTask);
router.get("/allTasks",authenticateToken, TaskController.fetchingAll);
router.delete("/delete/:id",authenticateToken, TaskController.deletefromDB);
router.put('/update/:id',authenticateToken,TaskController.editDetails)
export default router;
