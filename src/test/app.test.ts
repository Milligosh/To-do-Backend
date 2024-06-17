import chaiHttp from "chai-http";
import chai from "chai";
import { StatusCodes } from "http-status-codes";
import sinon from "sinon";
import sinonChai from "sinon-chai";
import pool from "../config/database/db";
import { taskQueries } from "../queries/tasks";
import { TaskService } from "../services/tasks.service";
import { userQueries } from "../queries/user";
import { CreateUserService } from "../services/user.service";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

chai.use(chaiHttp);
chai.use(sinonChai);

const expect = chai.expect;
describe("Task test", () => {
  let poolQueryStub: sinon.SinonStub;
  let bcryptCompareSyncStub: sinon.SinonStub;
  let jwtSignStub: sinon.SinonStub;
  let bcryptHashSyncStub: sinon.SinonStub;

  beforeEach(() => {
    poolQueryStub = sinon.stub(pool, "query");
    bcryptCompareSyncStub = sinon.stub(bcrypt, "compareSync");
    jwtSignStub = sinon.stub(jwt, "sign");

    bcryptHashSyncStub = sinon.stub(bcrypt, "hashSync");
  });

  afterEach(() => {
    poolQueryStub.restore();
    bcryptCompareSyncStub.restore();
    jwtSignStub.restore();
    bcryptHashSyncStub.restore();
  });

  it("should log in a user successfully", async () => {
    const body = {
      email: "millibelll@gmail.com",
      password: "12345678",
    };

    const user = {
      id: "1",
      firstname: "Milli",
      lastname: "Belll",
      username: "milliiibel",
      email: body.email,
      password: bcrypt.hashSync(body.password, 12), // Hashed password
      created_at: new Date(),
    };

    const token = "sample.jwt.token";

    poolQueryStub.resolves({ rows: [user] });
    bcryptCompareSyncStub.returns(true);
    jwtSignStub.returns(token);

    const result = await CreateUserService.logInUser(body);

    expect(result).to.deep.equal({
      status: "success",
      message: "User login successfully",
      code: 200,
      data: {
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        username: user.username,
        email: user.email,
        token: token,
        created_at: user.created_at,
      },
    });
    expect(poolQueryStub).to.have.been.calledOnceWith(
      userQueries.fetchUserByEmail,
      [body.email]
    );
    expect(bcryptCompareSyncStub).to.have.been.calledOnceWith(
      body.password,
      user.password
    );
    expect(jwtSignStub).to.have.been.calledOnce;
  });

  it("should fail to create a new user when email already exists", async () => {
    const body = {
      firstName: "Milli",
      lastName: "Belll",
      userName: "milliiibel",
      email: "millibelll@gmail.com",
      password: "12345678",
      phoneNumber: "0453877776",
    };

    poolQueryStub.resolves({ rows: [{ id: "1", ...body }] }); // User with email exists

    try {
      await CreateUserService.newUser(body);
    } catch (error: any) {
      expect(error).to.deep.equal({
        code: 409,
        message: "User already exists",
        data: null,
        status: "error",
      });
    }
    expect(poolQueryStub).to.have.been.calledOnceWith(
      userQueries.fetchUserByEmail,
      [body.email]
    );
  });

  it("should fail to create a new user when username already exists", async () => {
    const body = {
      firstname: "Milli",
      lastname: "Belll",
      username: "milliiibel",
      email: "millibelll@gmail.com",
      password: "12345678",
      phonenumber: "0453877776",
    };

    poolQueryStub.onFirstCall().resolves({ rows: [] }); // No user with the email
    poolQueryStub.onSecondCall().resolves({ rows: [{ id: "1", ...body }] }); // User with username exists

    try {
      await CreateUserService.newUser(body);
    } catch (error: any) {
      expect(error).to.deep.equal({
        code: 409,
        message: "User already exists",
        data: null,
        status: "error",
      });
    }
    expect(poolQueryStub).to.have.been.calledTwice;
    expect(poolQueryStub.firstCall).to.have.been.calledWith(
      userQueries.fetchUserByEmail,
      [body.email]
    );
    expect(poolQueryStub.secondCall).to.have.been.calledWith(
      userQueries.fetchUserByUsername,
      [body.username]
    );
  });

  it("should create a new task successfully", async () => {
    const body = {
      userId: "123",
      task: "New Task",
      priority: 1,
    };

    poolQueryStub.resolves({ rows: [{ id: "1", ...body }] });

    const result = await TaskService.createTask(body);

    expect(result).to.deep.equal({
      code: 201,
      status: "success",
      message: "New Post created successfully",
      data: { id: "1", ...body },
    });
    expect(poolQueryStub).to.have.been.calledOnceWith(taskQueries.createTask, [
      body.userId,
      body.task,
      body.priority,
    ]);
  });

  it("should fail to create a new task", async () => {
    const body = {
      userId: "123",
      task: "New Task",
      priority: 1,
    };

    const errorMessage = "Error creating task";
    poolQueryStub.rejects(new Error(errorMessage));

    const result = await TaskService.createTask(body);

    expect(result).to.deep.equal({
      code: 500,
      status: "error",
      message: "An error occurred while creating the task",
      error: errorMessage,
    });
    expect(poolQueryStub).to.have.been.calledOnceWith(taskQueries.createTask, [
      body.userId,
      body.task,
      body.priority,
    ]);
  });

  it("should successfully delete a task", async () => {
    const taskId = "1";
    const userId ="2"

    const taskDetails = {
      id: taskId,
      userId: "123",
      task: "Existing Task",
      priority: 1,
    };

    poolQueryStub.onFirstCall().resolves({ rows: [taskDetails] }); // Task found by ID
    poolQueryStub.onSecondCall().resolves({ rows: [] }); // Task deleted

    const result = await TaskService.deleteTask(taskId,userId);

    expect(result).to.deep.equal({
      status: "Success",
      message: `Task with id ${taskId} deleted successfully`,
      code: 200,
      data: taskDetails,
    });
    expect(poolQueryStub).to.have.been.calledTwice;
    expect(poolQueryStub.firstCall).to.have.been.calledWith(
      taskQueries.fetchTaskbyId,
      [taskId]
    );
    expect(poolQueryStub.secondCall).to.have.been.calledWith(
      taskQueries.deleteTask,
      [taskId]
    );
  });

  it("should fail to delete a task that does not exist", async () => {
    const taskId = "1";
    const userId ="2"

    poolQueryStub.resolves({ rows: [] }); // No task found by ID

    try {
      await TaskService.deleteTask(taskId,userId);
    } catch (error: any) {
      expect(error).to.deep.equal({
        status: "Error",
        message: `Task with id ${taskId} does not exist`,
        code: 400,
        data: null,
      });
    }
    expect(poolQueryStub).to.have.been.calledOnceWith(
      taskQueries.fetchTaskbyId,
      [taskId]
    );
  });

  it("should successfully delete a task", async () => {
    const taskId = "1";
    const userId ="2"

    const taskDetails = {
      id: taskId,
      userId: "123",
      task: "Existing Task",
      priority: 1,
    };

    poolQueryStub.onFirstCall().resolves({ rows: [taskDetails] }); // Task found by ID
    poolQueryStub.onSecondCall().resolves({ rows: [] }); // Task deleted

    const result = await TaskService.deleteTask(taskId,userId);

    expect(result).to.deep.equal({
      status: "Success",
      message: `Task with id ${taskId} deleted successfully`,
      code: 200,
      data: taskDetails,
    });
    expect(poolQueryStub).to.have.been.calledTwice;
    expect(poolQueryStub.firstCall).to.have.been.calledWith(
      taskQueries.fetchTaskbyId,
      [taskId]
    );
    expect(poolQueryStub.secondCall).to.have.been.calledWith(
      taskQueries.deleteTask,
      [taskId]
    );
  });

  it("should fail to delete a task that does not exist", async () => {
    const taskId = "1";
    const userId ="2"

    poolQueryStub.resolves({ rows: [] }); // No task found by ID

    try {
      await TaskService.deleteTask(taskId,userId);
    } catch (error: any) {
      expect(error).to.deep.equal({
        status: "Error",
        message: `Task with id ${taskId} does not exist`,
        code: 400,
        data: null,
      });
    }
    expect(poolQueryStub).to.have.been.calledOnceWith(
      taskQueries.fetchTaskbyId,
      [taskId]
    );
  });
});
