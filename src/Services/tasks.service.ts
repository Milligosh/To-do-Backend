import pool from "../config/database/db";
import { taskQueries } from "../queries/tasks";
import User from "./user.service";

export default interface Task {
  id: string;
  userid: string;
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
        message: "New task created successfully",
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
  static async fetchAll(userId:string,filters: any): Promise<any> {
    let query = taskQueries.fetchAllTasksForAUser ;
    const values: any[] = [userId];

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
    if (!data || data.length===0){
      throw{
        status: "error",
        message: "no tasks to fetch",
        code: 404,
        data:null
      }
    }else
    return {
      status: "success",
      message: "Tasks fetched successfully",
      code: 200,
      data,
    }
  }

  static async deleteTask(id: string, userId: string): Promise<any> {
    try {
      const findById: Task = (await pool.query(taskQueries.fetchTaskbyId, [id])).rows[0];

      if (!findById || findById.userid !== userId) {
        return {
          status: "Error",
          message: `Task with id ${id} does not exist or does not belong to the user`,
          code: 400,
          data: null,
        };
      }

      const deleteATask=(await pool.query(taskQueries.deleteTask, [id, userId])).rows[0];

      return {
        status: "Success",
        message: `Task with id ${id} deleted successfully`,
        code: 200,
        data: findById,
      };
    } catch (error) {
      console.error("Error deleting task:", error);
      return {
        status: "Error",
        message: "An error occurred while deleting the task",
        code: 500,
        data: null,
      };
    }
  }

  static async editDetails(userId:string ,body: any): Promise<any> {
    const { id, task, priority, completed } = body;
    const existingTask: Task = (
      await pool.query(taskQueries.checkIfTaskExist, [id])
    ).rows[0];
    if (!existingTask || existingTask.userid !== userId) {
      return {
        status: "Error",
        message: `Task with id ${id} does not exist or does not belong to the user`,
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
    const updateQuery: string = `UPDATE tasks SET ${updateFields.join(", ")} WHERE id=$${updateParams.length + 1} AND userId=$${updateParams.length + 2} RETURNING *`;
    updateParams.push(id, userId);
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
