import { FastifyInstance } from "fastify";
import { userController } from "./../controllers/userController";
import {
  loginSchema,
  signUpSchema,
  updateUserSchema,
  userIdSchema,
  refreshTokenSchema,
  uploadImageSchema,
} from "../dto/userSchema";
import { authenticate } from "../middleware/authMiddleware";
import {
  ImageUploadDto,
  LoginDto,
  RefreshTokenDto,
  UpdateUserDto,
  UserIdDto,
} from "../dto/user.dto";
import { WebSocketClient } from "../../utils/webSocketClient";

/**
 * Registers user-related routes with Fastify.
 * @param fastify - The Fastify instance used for registering routes.
 */
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

  fastify.post<{ Body: ImageUploadDto }>(
    "/users/upload-image",
    { preHandler: authenticate(), schema: uploadImageSchema },
    userController.uploadImage
  );

  fastify.delete<{ Params: UserIdDto }>(
    "/users/:id",
    { preHandler: authenticate(), schema: userIdSchema },
    userController.delete
  );

  fastify.post<{ Body: RefreshTokenDto }>(
    "/users/refresh-token",
    { schema: refreshTokenSchema },
    userController.refreshToken
  );

  fastify.get("/notifications", { websocket: true }, (connection) => {
    console.log("Client connected to WebSocket");

    connection.send(
      JSON.stringify({ message: "Connected to real-time notifications" })
    );

    connection.on("message", (message: Buffer | string) => {
      console.log("Received message from client:", message.toString());
    });

    WebSocketClient.addClient(connection);

    connection.on("close", () => {
      console.log("Client disconnected");
      WebSocketClient.removeClient(connection);
    });
  });
}

export default userRoutes;
