import fp from "fastify-plugin";
import { FastifyInstance, FastifyPluginCallback } from "fastify";
import dotenv from "dotenv";

dotenv.config();

interface Config {
  env: string;
  port: number;
  logLevel: string;
  auth: {
    google: {
      clientId: string;
      clientSecret: string;
    };
  };
}

declare module "fastify" {
  interface FastifyInstance {
    config: Config;
  }
}

const config: FastifyPluginCallback = (fastify: FastifyInstance, _, done) => {
  const config: Config = {
    env: process.env.environment || "development",
    port: parseInt(process.env.PORT || "3000", 10),
    logLevel: process.env.LOG_LEVEL || "trace",
    auth: {
      google: {
        clientId: process.env.GOOGLE_AUTH_CLIENT_ID || "",
        clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET || "",
      },
    },
  };

  fastify.decorate("config", config);
  done();
};

// export default prisma;
// Wrapping a plugin function with fastify-plugin exposes the decorators
// and hooks, declared inside the plugin to the parent scope.
// Otherwise, the decorators and hooks would only be available within the plugin scope.
// See: https://fastify.dev/docs/latest/Reference/Plugins/#handle-the-scope
export default fp(config);
