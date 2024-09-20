import { FastifyInstance } from "fastify";
import { userController } from "./../controllers/userController";
import {
  createUserSchema,
  updateUserSchema,
  userIdSchema,
} from "../dto/userSchema";

async function userRoutes(fastify: FastifyInstance) {
  fastify.post("/users", { schema: createUserSchema }, userController.create);
  fastify.get("/users/:id", { schema: userIdSchema }, userController.get);
  fastify.put(
    "/users/:id",
    { schema: updateUserSchema },
    userController.update
  );
  fastify.delete("/users/:id", { schema: userIdSchema }, userController.delete);
}

export default userRoutes;
