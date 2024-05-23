import { Request, Response, NextFunction } from "express";
import { CreateUserService } from "../Services/user.service";

export class UserController {
  static async newUser(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const result = await CreateUserService.newUser(request.body);
      return response.status(result.code).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async logUserIn(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const result = await CreateUserService.logInUser(request.body);
      return response.status(result.code).json(result);
    } catch (error) {
      next(error);
    }
    }}