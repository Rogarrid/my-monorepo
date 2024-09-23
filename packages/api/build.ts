import Fastify, { FastifyInstance } from "fastify";
import userRoute from "./routes/user";
import swagger from "@fastify/swagger";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

export function build(): FastifyInstance {
  const fastify = Fastify({ logger: true });

  fastify.register(swagger, {
    openapi: {
      info: {
        title: "API Documentation",
        description: "API documentation for my-monorepo",
        version: "1.0.0",
      },
      servers: [
        {
          url: "http://localhost:3000",
          description: "Development server",
        },
      ],
      tags: [{ name: "user", description: "User related end-points" }],
    },
  });

  fastify.get(
    "/documentation",
    { schema: { hide: true } },
    async (request, reply) => {
      reply.send(fastify.swagger());
    }
  );

  fastify.register(userRoute);

  return fastify;
}
