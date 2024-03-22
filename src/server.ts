import fastify, { FastifyInstance } from "fastify";

// import configPlugin, { Config } from "./plugins/config";
import prisma from "./plugins/prisma";
import { Config } from "./config";
import healthcheck from "./routes/healthcheck";
import users from "./routes/users";
import authn from "./routes/authn";
import authenticationMiddlware from "./middlewares/authn";
import idp from "./plugins/idp";

declare module "fastify" {
  interface FastifyInstance {
    config: Config;
  }
}

const envToLogger = (env: string) => {
  if (["development", "test"].includes(env)) {
    return {
      transport: {
        target: "pino-pretty",
        options: {
          translateTime: "HH:MM:ss Z",
          ignore: "pid,hostname",
        },
      },
    };
  }
  return true;
};

export default async function buildServer(
  config: Config
): Promise<FastifyInstance> {
  const app = fastify({
    logger: envToLogger(config.env),
  });

  await app.decorate("config", config);
  await app.register(prisma);
  // Setup IDP funcionalities and OAuth2 plugin if config requires it
  await app.register(idp);

  app.register(healthcheck);
  app.register(authn);

  // TODO: Is there a better way to do this?
  // Authentication protected routes
  app.register((app, _, done) => {
    app.addHook("preHandler", authenticationMiddlware(app));
    app.register(users);
    done();
  });

  return app;
}
