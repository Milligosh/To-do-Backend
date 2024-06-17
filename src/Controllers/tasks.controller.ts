import { NextFunction, Response, Request } from "express";
import { TaskService } from "../services/tasks.service";

export class TaskController {
  static async createNewTask(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const result = await TaskService.createTask({
        ...req.body,
        userId: (req as any)?.user?.id,
      });
      return res.status(result.code).json(result);
    } catch (error) {
      next(error);
    }
  }
  static async fetchingAll(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const filters = request.query;
      const userId=(request as any)?.user?.id
      const result = await TaskService.fetchAll(userId,filters);
      return response.status(result.code).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async deletefromDB(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<any> {
    try {
       const taskId=request.params.id
      const userId= (request as any).user.id
      const result = await TaskService.deleteTask(taskId, userId);
      return response.status(result.code).json(result);
    } catch (error) {
      next(error);
    }
  }
  static async editDetails(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      //  const {id}= request.params.id
      const result = await TaskService.editDetails((request as any)?.user?.id,{
        ...request.body,
        id: request.params.id
      });
      return response.status(result.code).json(result);
    } catch (error) {
      next(error);
    }
  }
}
