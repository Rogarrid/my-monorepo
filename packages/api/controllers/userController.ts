import { FastifyReply, FastifyRequest } from "fastify";
import {
  createUser,
  getUser,
  updateUser,
  deleteUser,
} from "../../services/userService";
import { UserDto, CreateUserDto, UpdateUserDto } from "../dto/user.dto";

export const userController = {
  create: async (
    request: FastifyRequest<{ Body: CreateUserDto }>,
    reply: FastifyReply
  ) => {
    const { name, email, password } = request.body;
    const user = await createUser(name, email, password);
    return reply.code(201).send(user);
  },

  get: async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) => {
    const userId = parseInt(request.params.id, 10);
    const user = await getUser(userId);
    if (!user) return reply.code(404).send({ message: "User not found" });
    return reply.send(user);
  },

  update: async (
    request: FastifyRequest<{ Params: { id: string }; Body: UpdateUserDto }>,
    reply: FastifyReply
  ) => {
    const id = parseInt(request.params.id, 10);
    const { name, email } = request.body;
    const user = await updateUser(id, name, email);
    return reply.send(user);
  },

  delete: async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) => {
    await deleteUser(parseInt(request.params.id, 10));
    return reply.code(204).send();
  },
};
