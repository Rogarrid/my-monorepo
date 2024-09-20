import { FastifyInstance } from "fastify";
import { helloController } from "./../controllers/helloController";
import { helloSchema } from "../dto/hello-schema";

async function helloRoutes(fastify: FastifyInstance) {
  fastify.get("/", helloController);
  fastify.post("/", { schema: helloSchema }, helloController);
}

export default helloRoutes;
