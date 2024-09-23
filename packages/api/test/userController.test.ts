import { userController } from "../controllers/userController";
import {
  signUp,
  getUser,
  updateUser,
  deleteUser,
  signIn,
  refreshTokenService,
} from "../../services/userService";
import { FastifyRequest, FastifyReply } from "fastify";
import {
  LoginDto,
  RefreshTokenDto,
  UpdateUserDto,
  UserIdDto,
  signUpDto,
} from "../dto/user.dto";

jest.mock("../../services/userService");

describe("userController", () => {
  describe("create", () => {
    it("should create a user and return access token", async () => {
      const request = {
        body: {
          name: "Test User",
          email: "test@gmail.com",
          password: "testpassword",
        },
      } as FastifyRequest<{ Body: signUpDto }>;

      const reply = {
        code: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as unknown as FastifyReply;

      const mockUser = { id: 1, username: "testuser" };
      const mockAccessToken = "mockAccessToken";

      (signUp as jest.Mock).mockResolvedValueOnce({
        user: mockUser,
        accessToken: mockAccessToken,
      });

      await userController.create(request, reply);

      expect(signUp).toHaveBeenCalledWith(request.body);
      expect(reply.code).toHaveBeenCalledWith(201);
      expect(reply.send).toHaveBeenCalledWith({
        user: mockUser,
        accessToken: mockAccessToken,
      });
    });

    it("should handle errors", async () => {
      const request = {
        body: {
          name: "Test User",
          email: "test@gmail.com",
          password: "testpassword",
        },
      } as FastifyRequest<{ Body: signUpDto }>;

      const reply = {
        code: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as unknown as FastifyReply;

      const error = new Error("Error creating user");
      (signUp as jest.Mock).mockRejectedValueOnce(error);

      await userController.create(request, reply);

      expect(reply.code).toHaveBeenCalledWith(500);
      expect(reply.send).toHaveBeenCalledWith({
        code: 500,
        message: "Error creating user",
      });
    });
  });

  describe("login", () => {
    it("should log in a user and return response", async () => {
      const request = {
        body: {
          email: "test@gmail.com",
          password: "testpassword",
        },
      } as FastifyRequest<{ Body: LoginDto }>;

      const reply = {
        code: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as unknown as FastifyReply;

      const mockResponse = { message: "Logged in successfully" };
      (signIn as jest.Mock).mockResolvedValueOnce(mockResponse);

      await userController.login(request, reply);

      expect(signIn).toHaveBeenCalledWith(request.body);
      expect(reply.code).toHaveBeenCalledWith(200);
      expect(reply.send).toHaveBeenCalledWith(mockResponse);
    });

    it("should handle errors", async () => {
      const request = {
        body: {
          email: "test@gmail.com",
          password: "testpassword",
        },
      } as FastifyRequest<{ Body: LoginDto }>;

      const reply = {
        code: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as unknown as FastifyReply;

      const error = new Error("Login error");
      (signIn as jest.Mock).mockRejectedValueOnce(error);

      await userController.login(request, reply);

      expect(reply.code).toHaveBeenCalledWith(500);
      expect(reply.send).toHaveBeenCalledWith({
        code: 500,
        message: "Login error",
      });
    });
  });

  describe("get", () => {
    it("should retrieve a user by ID", async () => {
      const request = {
        params: { id: "1" },
      } as FastifyRequest<{ Params: UserIdDto }>;

      const reply = {
        send: jest.fn(),
        code: jest.fn().mockReturnThis(),
      } as unknown as FastifyReply;

      const mockUser = { id: 1, username: "testuser" };
      (getUser as jest.Mock).mockResolvedValueOnce(mockUser);

      await userController.get(request, reply);

      expect(getUser).toHaveBeenCalledWith(1);
      expect(reply.send).toHaveBeenCalledWith(mockUser);
    });

    it("should return 404 if user not found", async () => {
      const request = {
        params: { id: "1" },
      } as FastifyRequest<{ Params: UserIdDto }>;

      const reply = {
        send: jest.fn(),
        code: jest.fn().mockReturnThis(),
      } as unknown as FastifyReply;

      (getUser as jest.Mock).mockResolvedValueOnce(null);

      await userController.get(request, reply);

      expect(reply.code).toHaveBeenCalledWith(404);
      expect(reply.send).toHaveBeenCalledWith({ message: "User not found" });
    });

    it("should handle errors", async () => {
      const request = {
        params: { id: "1" },
      } as FastifyRequest<{ Params: UserIdDto }>;

      const reply = {
        send: jest.fn(),
        code: jest.fn().mockReturnThis(),
      } as unknown as FastifyReply;

      const error = new Error("Error fetching user");
      (getUser as jest.Mock).mockRejectedValueOnce(error);

      await userController.get(request, reply);

      expect(reply.code).toHaveBeenCalledWith(500);
      expect(reply.send).toHaveBeenCalledWith({
        code: 500,
        message: "Error fetching user",
      });
    });
  });

  describe("update", () => {
    it("should update a user", async () => {
      const request = {
        params: { id: "1" },
        body: {
          name: "Updated User",
          email: `updated_${Date.now()}@example.com`,
          role: "user",
          password: "newpassword123",
        } as UpdateUserDto,
      } as FastifyRequest<{ Params: UserIdDto; Body: UpdateUserDto }>;

      const reply = {
        send: jest.fn(),
      } as unknown as FastifyReply;

      const mockUser = { id: 1, username: "updatedUser" };
      (updateUser as jest.Mock).mockResolvedValueOnce(mockUser);

      await userController.update(request, reply);

      expect(updateUser).toHaveBeenCalledWith(1, request.body);
      expect(reply.send).toHaveBeenCalledWith(mockUser);
    });

    it("should handle errors", async () => {
      const request = {
        params: { id: "1" },
        body: {
          name: "Updated User",
          email: `updated_${Date.now()}@example.com`,
          role: "user",
          password: "newpassword123",
        } as UpdateUserDto,
      } as FastifyRequest<{ Params: UserIdDto; Body: UpdateUserDto }>;

      const reply = {
        send: jest.fn(),
        code: jest.fn().mockReturnThis(),
      } as unknown as FastifyReply;

      const error = new Error("Error updating user");
      (updateUser as jest.Mock).mockRejectedValueOnce(error);

      await userController.update(request, reply);

      expect(reply.code).toHaveBeenCalledWith(500);
      expect(reply.send).toHaveBeenCalledWith({
        code: 500,
        message: "Error updating user",
      });
    });
  });

  describe("delete", () => {
    it("should delete a user", async () => {
      const request = {
        params: { id: "1" },
      } as FastifyRequest<{ Params: UserIdDto }>;

      const reply = {
        code: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as unknown as FastifyReply;

      await userController.delete(request, reply);

      expect(deleteUser).toHaveBeenCalledWith(1);
      expect(reply.code).toHaveBeenCalledWith(200);
      expect(reply.send).toHaveBeenCalledWith({ message: "User deleted" });
    });

    it("should handle errors", async () => {
      const request = {
        params: { id: "1" },
      } as FastifyRequest<{ Params: UserIdDto }>;

      const reply = {
        code: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as unknown as FastifyReply;

      const error = new Error("Error deleting user");
      (deleteUser as jest.Mock).mockRejectedValueOnce(error);

      await userController.delete(request, reply);

      expect(reply.code).toHaveBeenCalledWith(500);
      expect(reply.send).toHaveBeenCalledWith({
        code: 500,
        message: "Error deleting user",
      });
    });
  });

  describe("refreshToken", () => {
    it("should refresh the access token", async () => {
      const request = {
        body: {
          refreshToken: "mockRefreshToken",
        },
      } as FastifyRequest<{ Body: RefreshTokenDto }>;

      const reply = {
        send: jest.fn(),
      } as unknown as FastifyReply;

      const mockAccessToken = "mockAccessToken";
      (refreshTokenService as jest.Mock).mockResolvedValueOnce(mockAccessToken);

      await userController.refreshToken(request, reply);

      expect(refreshTokenService).toHaveBeenCalledWith("mockRefreshToken");
      expect(reply.send).toHaveBeenCalledWith({ accessToken: mockAccessToken });
    });

    it("should return 400 if refresh token is not provided", async () => {
      const request = {
        body: {},
      } as FastifyRequest<{ Body: RefreshTokenDto }>;

      const reply = {
        code: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as unknown as FastifyReply;

      await userController.refreshToken(request, reply);

      expect(reply.code).toHaveBeenCalledWith(400);
      expect(reply.send).toHaveBeenCalledWith({
        message: "Refresh token not found",
      });
    });

    it("should handle errors", async () => {
      const request = {
        body: {
          refreshToken: "mockRefreshToken",
        },
      } as FastifyRequest<{ Body: RefreshTokenDto }>;

      const reply = {
        code: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as unknown as FastifyReply;

      const error = new Error("Error refreshing token");
      (refreshTokenService as jest.Mock).mockRejectedValueOnce(error);

      await userController.refreshToken(request, reply);

      expect(reply.code).toHaveBeenCalledWith(500);
      expect(reply.send).toHaveBeenCalledWith({
        code: 500,
        message: "Error refreshing token",
      });
    });
  });
});
