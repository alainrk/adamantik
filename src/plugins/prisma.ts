import fp from "fastify-plugin";
import { PrismaClient } from "@prisma/client";
import { FastifyInstance, FastifyPluginCallback } from "fastify";

declare module "fastify" {
  interface FastifyInstance {
    prisma: PrismaClient;
  }
}

const prisma: FastifyPluginCallback = (app: FastifyInstance, _, done) => {
  // Initialize Prisma client
  const prisma = new PrismaClient();

  // Expose Prisma client within the Fastify object
  app.decorate("prisma", prisma);

  // Call done to signal that plugin registration is complete
  done();
};

// Wrapping a plugin function with fastify-plugin exposes the decorators
// and hooks, declared inside the plugin to the parent scope.
// Otherwise, the decorators and hooks would only be available within the plugin scope.
// See: https://fastify.dev/docs/latest/Reference/Plugins/#handle-the-scope
export default fp(prisma);
