import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { userController } from "./../controllers/userController";
import {
  loginSchema,
  signUpSchema,
  updateUserSchema,
  userIdSchema,
} from "../dto/userSchema";

async function userRoutes(fastify: FastifyInstance) {
  fastify.post("/users", { schema: signUpSchema }, userController.create);
  fastify.post(
    "/login",
    {
      schema: loginSchema,
    },
    userController.login
  );

  fastify.get("/users/:id", { schema: userIdSchema }, userController.get);
  fastify.put(
    "/users/:id",
    { schema: updateUserSchema },
    userController.update
  );
  fastify.delete("/users/:id", { schema: userIdSchema }, userController.delete);
}

export default userRoutes;
