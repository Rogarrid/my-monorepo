import { FastifyInstance } from "fastify";
import { userController } from "./../controllers/userController";
import {
  loginSchema,
  signUpSchema,
  updateUserSchema,
  userIdSchema,
} from "../dto/userSchema";
import { authenticate } from "../middleware/authMiddleware";
import { LoginDto, UpdateUserDto, UserIdDto } from "../dto/user.dto";

async function userRoutes(fastify: FastifyInstance) {
  fastify.post("/users", { schema: signUpSchema }, userController.create);
  fastify.post<{ Body: LoginDto }>(
    "/users/login",
    {
      preHandler: authenticate(),
      schema: loginSchema,
    },
    userController.login
  );
  fastify.get<{ Params: UserIdDto }>(
    "/users/:id",
    { preHandler: authenticate(["admin"]), schema: userIdSchema },
    userController.get
  );
  fastify.put<{ Params: UserIdDto; Body: UpdateUserDto }>(
    "/users/:id",
    { preHandler: authenticate(), schema: updateUserSchema },
    userController.update
  );
  fastify.delete<{ Params: UserIdDto }>(
    "/users/:id",
    { preHandler: authenticate(), schema: userIdSchema },
    userController.delete
  );
}

export default userRoutes;
