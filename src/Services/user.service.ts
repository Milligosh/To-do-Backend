import pool from "../config/database/db";
import { userQueries } from "../Queries/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../config/env/development";



export default interface User {
  id: string;
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  password: string;
  phonenumber: string;
  created_at: string;
}

export class CreateUserService {
  static async newUser(body: any): Promise<any> {
    const { firstName, lastName, userName, email, password, phoneNumber } =
      body;

    const userExist: User = (await pool.query(userQueries.fetchUserByEmail, [email])).rows[0];

    if (userExist) {
      throw {
        code: 409,
        message: "User already exists",
        data: null,
        status: "error",
      };
    }

    const userNameExist: User = (await pool.query(userQueries.fetchUserByUsername, [userName])).rows[0];

    if (userNameExist) {
      throw {
        code: 409,
        message: "User already exists",
        data: null,
        status: "error",
      };
    }

    const saltRounds = 12;
    const hashPassword: string = bcrypt.hashSync(password, saltRounds);
    const response = await pool.query(userQueries.createNewUser, [
      firstName,
      lastName,
      userName,
      email,
      hashPassword,
      phoneNumber,
    ]);

    return {
      code: 201,
      status: "success",
      message: "New user added successfully",
      data: response.rows[0],
    };
  }

  static async logInUser(body: any): Promise<any> {
    const { email, password } = body;

    const checkIfExist: User = (await pool.query(userQueries.fetchUserByEmail, [email])).rows[0];

    if (!checkIfExist) {
      throw {
        code: 409,
        status: "error",
        message: "User does not have an account",
        data: null,
      };
    }

    const {
      password: databasePassword,
      firstname,
      lastname,
      username,
      id,
      created_at,
    } = checkIfExist;

    const comparePassword: boolean = bcrypt.compareSync(password, databasePassword);

    if (!comparePassword) {
      throw {
        code: 409,
        status: "error",
        message: "Wrong log-In credentials",
        data: null,
      };
    }

    const options: jwt.SignOptions = {
      expiresIn: "1d",
    };

    const token: string = jwt.sign(
      {
        id,
        firstname,
        lastname,
        email,
      },
      config.JWT_SECRET as string,
      options
    );

    return {
      status: "success",
      message: "User login successfully",
      code: 200,
      data: {
        id,
        firstname,
        lastname,
        username,
        email,
        token,
        created_at,
      },
    };
  }}
