import fastify from "fastify";
import { OAuth2Namespace } from "@fastify/oauth2";
import oauthPlugin from "@fastify/oauth2";

import config from "./plugins/config";
import prisma from "./plugins/prisma";
import healthcheck from "./routes/healthcheck";
import users from "./routes/users";

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

app.register(config).after(() => {
  // Register Prisma DB plugin
  app.register(prisma);

  // TODO: Register routes in one place
  app.register(users);
  app.register(healthcheck);

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
    // register a fastify url to start the redirect flow
    startRedirectPath: "/login/google",
    // google will redirect here after the user login
    callbackUri: "http://localhost:3000/login/google/callback",
  });

  app.get("/login/google/callback", async function (request, reply) {
    const { token } =
      await this.googleOAuth2.getAccessTokenFromAuthorizationCodeFlow(request);

    console.log(token.access_token);

    // if later you need to refresh the token you can use
    // const { token: newToken } = await this.getNewAccessTokenUsingRefreshToken(token)

    reply.send({ access_token: token.access_token });
  });
});

app.listen({ port: 3000 }, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`🚀 Server ready at: http://localhost:3000`);
});
