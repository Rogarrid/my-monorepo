import { FastifyReply, FastifyRequest } from "fastify";
import {
  signUp,
  getUser,
  updateUser,
  deleteUser,
  signIn,
} from "../../services/userService";
import { LoginDto, signUpDto, UpdateUserDto, UserIdDto } from "../dto/user.dto";
import { getErrorMessage } from "../../utils/errors";
import { authenticate } from "../middleware/authMiddleware";

export const userController = {
  create: async (
    request: FastifyRequest<{ Body: signUpDto }>,
    reply: FastifyReply
  ) => {
    try {
      const userData = request.body;
      const { user, accessToken } = await signUp(userData);
      return reply.code(201).send({ user, accessToken });
    } catch (error) {
      return getErrorMessage(error, reply);
    }
  },

  login: async (
    request: FastifyRequest<{ Body: LoginDto }>,
    reply: FastifyReply
  ) => {
    const authHeader = request.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    try {
      const loginData = request.body;
      const response = await signIn(loginData, token);
      return reply.code(200).send(response);
    } catch (error) {
      return getErrorMessage(error, reply);
    }
  },

  get: async (
    request: FastifyRequest<{ Params: UserIdDto }>,
    reply: FastifyReply
  ) => {
    try {
      const userId = parseInt(request.params.id, 10);
      const user = await getUser(userId);
      if (!user) return reply.code(404).send({ message: "User not found" });
      return reply.send(user);
    } catch (error) {
      return getErrorMessage(error, reply);
    }
  },

  update: async (
    request: FastifyRequest<{ Params: UserIdDto; Body: UpdateUserDto }>,
    reply: FastifyReply
  ) => {
    try {
      const id = parseInt(request.params.id, 10);
      const userData = request.body;
      const user = await updateUser(id, userData);
      return reply.send(user);
    } catch (error) {
      return getErrorMessage(error, reply);
    }
  },

  delete: async (
    request: FastifyRequest<{ Params: UserIdDto }>,
    reply: FastifyReply
  ) => {
    try {
      await deleteUser(parseInt(request.params.id, 10));
      return reply.code(200).send({ message: "User deleted" });
    } catch (error) {
      return getErrorMessage(error, reply);
    }
  },
};
