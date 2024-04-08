import fastify, { FastifyInstance } from "fastify";

import { Config } from "./config";
import healthcheck from "./routes/healthcheck";
import users from "./routes/users";
import authn from "./routes/authn";
import authenticationMiddlware from "./middlewares/authn";
import idp from "./plugins/idp";
import { PrismaClient } from "./libs/prisma";
import workouts from "./routes/workouts";
import mesocycles from "./routes/mesocycles";
import exercises from "./routes/exercises";

declare module "fastify" {
  interface FastifyInstance {
    config: Config;
    prisma: PrismaClient;
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
  config: Config,
  prisma: PrismaClient
): Promise<FastifyInstance> {
  const app = fastify({
    logger: envToLogger(config.env),
  });

  await app.decorate("config", config);
  // TODO: Try to fix this in testing env, prisma doesn't get decorated for some reason.
  await app.decorate("prisma", prisma);

  // Setup IDP funcionalities and OAuth2 plugin if config requires it
  await app.register(idp);

  app.register(healthcheck);
  app.register(authn);

  // TODO: Is there a better way to do this?
  // Authentication protected routes
  app.register((app, _, done) => {
    app.addHook("preHandler", authenticationMiddlware(app));
    app.register(users);
    app.register(workouts);
    app.register(mesocycles);
    app.register(exercises);
    done();
  });

  return app;
}
