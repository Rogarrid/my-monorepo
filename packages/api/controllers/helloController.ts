import { FastifyReply, FastifyRequest } from "fastify";
import { HelloWorldRequestDto } from "../dto/hello.dto";

export const helloController = async (
  request: FastifyRequest<{
    Body: HelloWorldRequestDto;
  }>,
  reply: FastifyReply
) => {
  if (request.method === "GET") {
    return { message: "Hello world" };
  } else if (request.method === "POST") {
    return { hello: request.body.name || "You did not send any message" };
  }
};
