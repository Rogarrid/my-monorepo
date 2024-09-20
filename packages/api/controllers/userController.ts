import { FastifyReply, FastifyRequest } from "fastify";
import {
  createUser,
  getUser,
  updateUser,
  deleteUser,
} from "../../services/userService";
import { CreateUserDto, UpdateUserDto, UserIdDto } from "../dto/user.dto";
import { getErrorMessage } from "../../utils/errors";

export const userController = {
  create: async (
    request: FastifyRequest<{ Body: CreateUserDto }>,
    reply: FastifyReply
  ) => {
    try {
      const { name, email, password } = request.body;
      const user = await createUser(name, email, password);
      console.log("create user", user);
      return reply.code(201).send(user);
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
      const { name, email } = request.body;
      const user = await updateUser(id, name, email);
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
