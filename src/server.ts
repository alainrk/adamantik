import fastify from "fastify";
import { OAuth2Namespace } from "@fastify/oauth2";
import oauthPlugin from "@fastify/oauth2";

import config from "./plugins/config";
import prisma from "./plugins/prisma";
import healthcheck from "./routes/healthcheck";
import users from "./routes/users";
import authn from "./routes/authn";

declare module "fastify" {
  interface FastifyInstance {
    googleOAuth2: OAuth2Namespace;
  }
}

const envToLogger = {
  development: {
    transport: {
      target: "pino-pretty",
      options: {
        translateTime: "HH:MM:ss Z",
        ignore: "pid,hostname",
      },
    },
  },
  production: true,
  test: false,
};

const app = fastify({
  // TODO: Config setup including env
  logger: envToLogger["development"],
});

// TODO: Is there anything better than nesting these two?
app.register(config).after(() => {
  app.register(prisma).after(() => {
    // TODO: Register domain routes in a single place
    app.register(healthcheck);
    app.register(users);
    app.register(authn);

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
  });
});

app.listen({ port: 3000 }, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`🚀 Server ready at: http://localhost:3000`);
});
