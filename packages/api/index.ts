import { build } from "./build";

const fastify = build();

const PORT = Number(process.env.PORT) || 3000;

fastify.listen({ port: PORT }, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info(`Server listening at ${address}`);
});
