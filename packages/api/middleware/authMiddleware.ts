import { FastifyReply, FastifyRequest } from "fastify";
import jwt from "jsonwebtoken";

const secretKey = process.env.JWT_SECRET!;

/**
 * Middleware to authenticate users using JWT.
 * @param roles - An array of roles that are allowed to access the route.
 * If provided, the user must have one of the specified roles.
 */
export const authenticate = (roles: string[] = []) => {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const authHeader = request.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) return reply.code(401).send({ message: "Unauthorized" });

    try {
      const decoded = jwt.verify(token, secretKey) as {
        id: number;
        role: string;
      };
      request["user"] = decoded;

      if (roles.length && !roles.includes(decoded.role)) {
        return reply.code(403).send({ message: "Access denied for this role" });
      }

      return;
    } catch (err) {
      return reply.code(403).send({ message: "Forbidden" });
    }
  };
};
