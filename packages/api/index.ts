import Fastify from "fastify";
import helloRoutes from "./routes/hello";

const fastify = Fastify({ logger: true });

fastify.register(helloRoutes);

fastify.listen({ port: 3000 }, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info(`Server listening at ${address}`);
});
