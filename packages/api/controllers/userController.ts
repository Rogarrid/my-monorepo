import { FastifyReply, FastifyRequest } from "fastify";
import {
  signUp,
  getUser,
  updateUser,
  deleteUser,
  signIn,
  refreshTokenService,
  uploadUserImageService,
} from "../../services/userService";
import {
  ImageUploadDto,
  LoginDto,
  RefreshTokenDto,
  signUpDto,
  UpdateUserDto,
  UserIdDto,
} from "../dto/user.dto";
import { getErrorMessage } from "../../utils/errors";
import { WebSocketClient } from "../../utils/webSocketClient";

export const userController = {
  /**
   * Creates a new user.
   * @param request - Contains the data for the new user.
   * @param reply - The response that will be sent to the client.
   */
  create: async (
    request: FastifyRequest<{ Body: signUpDto }>,
    reply: FastifyReply
  ) => {
    try {
      const userData = request.body;
      const { user, accessToken } = await signUp(userData);
      WebSocketClient.broadcast(
        JSON.stringify({ event: "USER_CREATED", data: user })
      );
      return reply.code(200).send({ user, accessToken });
    } catch (error) {
      return getErrorMessage(error, reply);
    }
  },

  /**
   * Logs in a user and returns an access token.
   * @param request - Contains the login credentials.
   * @param reply - The response that will be sent to the client.
   */
  login: async (
    request: FastifyRequest<{ Body: LoginDto }>,
    reply: FastifyReply
  ) => {
    try {
      const loginData = request.body;
      const { user, accessToken } = await signIn(loginData);
      return reply.code(200).send({ user, accessToken });
    } catch (error) {
      return getErrorMessage(error, reply);
    }
  },

  /**
   * Retrieves a user by ID.
   * @param request - Contains the user ID in the parameters.
   * @param reply - The response that will be sent to the client.
   */
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

  /**
   * Updates a user's details.
   * @param request - Contains the user ID in the parameters and updated data in the body.
   * @param reply - The response that will be sent to the client.
   */
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

  /**
   * Uploads an image to Cloudinary and returns the optimized and transformed URLs.
   * @param request - Contains the image URL in the body.
   * @param reply - The response that will be sent to the client.
   */
  uploadImage: async (
    request: FastifyRequest<{ Body: ImageUploadDto }>,
    reply: FastifyReply
  ) => {
    try {
      const { imageUrl, publicId } = request.body;
      const { optimizedUrl, transformedUrl } = await uploadUserImageService(
        imageUrl,
        publicId
      );

      return reply.code(200).send({ optimizedUrl, transformedUrl });
    } catch (error) {
      return getErrorMessage(error, reply);
    }
  },

  /**
   * Deletes a user by ID.
   * @param request - Contains the user ID in the parameters.
   * @param reply - The response that will be sent to the client.
   */
  delete: async (
    request: FastifyRequest<{ Params: UserIdDto }>,
    reply: FastifyReply
  ) => {
    try {
      await deleteUser(parseInt(request.params.id, 10));
      WebSocketClient.broadcast(
        JSON.stringify({ event: "USER_CREATED", data: request.params.id })
      );
      return reply.code(200).send({ message: "User deleted" });
    } catch (error) {
      return getErrorMessage(error, reply);
    }
  },

  /**
   * Refreshes the access token using the provided refresh token.
   * @param request - Contains the refresh token in the body.
   * @param reply - The response that will be sent to the client.
   */
  refreshToken: async (
    request: FastifyRequest<{ Body: RefreshTokenDto }>,
    reply: FastifyReply
  ) => {
    try {
      const { refreshToken } = request.body;

      if (!refreshToken) {
        return reply.code(400).send({ message: "Refresh token not found" });
      }

      const accessToken = await refreshTokenService(refreshToken);

      return reply.send({
        accessToken: accessToken.newAccessToken,
        refreshToken,
      });
    } catch (error) {
      return getErrorMessage(error, reply);
    }
  },
};
