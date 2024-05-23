import express from "express";

const api = express.Router();
import users from "../../routes/user";
 import tasks from "../../routes/tasks"

api.get("/", (req, res) =>
  res.status(200).json({
    status: "success",
    message: "Welcome to My App API",
  })
);

api.use("/users", users);
api.use("/tasks", tasks )
export default api;
