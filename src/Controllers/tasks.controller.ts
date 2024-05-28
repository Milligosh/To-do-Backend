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
      const result = await TaskService.fetchAll(filters);
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
      //  const {id}=request.params.id
      const result = await TaskService.deleteTask(request.params.id);
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
      const result = await TaskService.editDetails({
        ...request.body,
        id: request.params.id,
      });
      return response.status(result.code).json(result);
    } catch (error) {
      next(error);
    }
  }
}
