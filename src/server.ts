import fastify, { FastifyInstance } from "fastify";
import { OAuth2Namespace } from "@fastify/oauth2";
import oauthPlugin from "@fastify/oauth2";

// import configPlugin, { Config } from "./plugins/config";
import prisma from "./plugins/prisma";
import { Config } from "./config";
import healthcheck from "./routes/healthcheck";
import users from "./routes/users";
import authn from "./routes/authn";
import authenticationMiddlware from "./middlewares/authn";

declare module "fastify" {
  interface FastifyInstance {
    googleOAuth2: OAuth2Namespace;
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

  // await app.register(configPlugin);
  await app.decorate("config", config);
  await app.register(prisma);

  app.register(oauthPlugin, {
    name: "googleOAuth2",
    scope: ["profile", "email"],
    credentials: {
      client: {
        id: config?.auth?.google?.clientId,
        secret: config?.auth?.google?.clientSecret,
      },
      auth: oauthPlugin.GOOGLE_CONFIGURATION,
    },
    // Register a fastify url to start the redirect flow
    startRedirectPath: "/login/google",
    // Google will redirect here after the user login
    callbackUri: "http://localhost:3000/login/google/callback",
  });

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
