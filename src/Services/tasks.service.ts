import pool from "../config/database/db";
import { taskQueries } from "../queries/tasks";
import User from "./user.service";

export default interface Task {
  id: string;
  userId: string;
  task: string;
  created_at: string;
  updated_at: string;
  priority: number;
  completed: boolean;
}

export class TaskService {
  static async createTask(body: any): Promise<any> {
    const { userId, task, priority } = body;

    
    // const checkIfExist:Task= (await pool.query(taskQueries.checkUserExist,[id])).rows[0]
    // if (!checkIfExist){
    //   return{
    //     code: 400,
    //     status: "error",
    //     message: "User does not exist",
    //     data: null,
    //   }
    // }

    try {
      const { rows } = await pool.query(taskQueries.createTask, [
        userId,
        task,
        priority,
      ]);

      return {
        code: 201,
        status: "success",
        message: "New Post created successfully",
        data: rows[0],
      };
    } catch (error: any) {
      console.error("Error creating task:", error);
      return {
        code: 500,
        status: "error",
        message: "An error occurred while creating the task",
        error: error.message,
      };
    }
  }
  static async fetchAll(filters: any): Promise<any> {
    let query = taskQueries.fetchAllTasksForAUser ;
    const values: any[] = [];

    if (filters.priority) {
      query += ` AND priority = $${values.length + 1}`;
      values.push(filters.priority);
    }

    if (filters.completed) {
      query += ` AND completed = $${values.length + 1}`;
      values.push(filters.completed);
    }
    if (filters.search) {
      query += ` AND (task ILIKE $${values.length + 1} OR userId::text ILIKE $${
        values.length + 1
      })`;
      values.push(`%${filters.search}%`);
    }
    
    const data: Task[] = (await pool.query(query, values)).rows;

    return {
      status: "success",
      message: "Tasks fetched successfully",
      code: 200,
      data,
    };
  }

  static async deleteTask(id: string): Promise<any> {
    const findById: User = (await pool.query(taskQueries.fetchTaskbyId, [id]))
      .rows[0];

    if (!findById) {
      throw {
        status: "Error",
        message: `Task with id ${id} does not exist`,
        code: 400,
        data: null,
      };
    } else
      try {
        const taskDetails = (await pool.query(taskQueries.deleteTask, [id]))
          .rows[0];
        return {
          status: "Success",
          message: `Task with id ${id} deleted successfully`,
          code: 200,
          data: findById,
        };
      } catch (error) {
        next(error);
      }
  }

  static async editDetails(body: any): Promise<any> {
    const { id, task, priority, completed } = body;
    const existingTask: Task = (
      await pool.query(taskQueries.checkIfTaskExist, [id])
    ).rows[0];
    if (!existingTask) {
      return {
        status: "Error",
        message: `Task with id ${id} does not exist`,
        code: 400,
        data: null,
      };
    }
    const updateParams: any[] = [];
    const updateFields: string[] = [];
    const addUpdateField = (paramValue: any, paramName: string) => {
      if (paramValue !== undefined) {
        updateParams.push(paramValue);
        updateFields.push(`${paramName}=$${updateParams.length}`);
      }
    };
    addUpdateField(task, "task");
    addUpdateField(priority, "priority");
    addUpdateField(completed, "completed");
    if (updateParams.length === 0) {
      return {
        status: "Error",
        message: `No fields provided for update`,
        code: 400,
        data: null,
      };
    }
    const updateQuery: string = `UPDATE tasks SET ${updateFields.join(
      ","
    )} WHERE id=$${updateParams.length + 1}`;
    updateParams.push(id);
    const data: Task = (await pool.query(updateQuery, updateParams)).rows[0];
    const updatedTaskQueryResult = await pool.query(taskQueries.fetchTaskbyId, [
      id,
    ]);
    const updatedTask: Task = updatedTaskQueryResult.rows[0];
    updatedTask.completed = completed;
    return {
      status: "Success",
      message: `Task with id ${id} updated successfully`,
      code: 200,
      data: updatedTask
    };
  }
}
function next(errror: any) {
  throw new Error("Function not implemented.");
}
