import { FastifyReply, FastifyRequest } from "fastify";
import jwt from "jsonwebtoken";

const secretKey = process.env.JWT_SECRET!;

export const authenticate = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const authHeader = request.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return reply.code(401).send({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, secretKey);
    request["user"] = decoded;
    return;
  } catch (err) {
    return reply.code(403).send({ message: "Forbidden" });
  }
};
