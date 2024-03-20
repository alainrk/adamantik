import fastify from "fastify";
import { OAuth2Namespace } from "@fastify/oauth2";
import oauthPlugin from "@fastify/oauth2";
import dotenv from "dotenv";

import config from "./plugins/config";
import prisma from "./plugins/prisma";
import healthcheck from "./routes/healthcheck";
import users from "./routes/users";
import authn from "./routes/authn";

dotenv.config();

declare module "fastify" {
  interface FastifyInstance {
    googleOAuth2: OAuth2Namespace;
  }
}

const envToLogger = (env: string) => {
  if (env === "development") {
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

async function main() {
  const app = fastify({
    logger: envToLogger(process.env.ENVIRONMENT || "development"),
  });

  await app.register(config);
  await app.register(prisma);

  app.register(oauthPlugin, {
    name: "googleOAuth2",
    scope: ["profile", "email"],
    credentials: {
      client: {
        id: app.config?.auth?.google?.clientId,
        secret: app.config?.auth?.google?.clientSecret,
      },
      auth: oauthPlugin.GOOGLE_CONFIGURATION,
    },
    // Register a fastify url to start the redirect flow
    startRedirectPath: "/login/google",
    // Google will redirect here after the user login
    callbackUri: "http://localhost:3000/login/google/callback",
  });

  // TODO: Register domain routes in a single place
  app.register(healthcheck);
  app.register(users);
  app.register(authn);

  app.listen({ port: 3000 }, (err) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`🚀 Server ready at: http://localhost:3000`);
  });
}

main();
