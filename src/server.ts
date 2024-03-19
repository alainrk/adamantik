import fastify from "fastify";
import { OAuth2Namespace } from "@fastify/oauth2";
import oauthPlugin from "@fastify/oauth2";
import axios from "axios";

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

// TODO: Is there anything better than nesting these two?
app.register(config).after(() => {
  app.register(prisma).after(() => {
    // TODO: Register domain routes in a single place
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
      // Register a fastify url to start the redirect flow
      startRedirectPath: "/login/google",
      // Google will redirect here after the user login
      callbackUri: "http://localhost:3000/login/google/callback",
    });

    app.get("/login/google/callback", async function (request, reply) {
      const { token } =
        await app.googleOAuth2.getAccessTokenFromAuthorizationCodeFlow(request);

      let providerData = null;
      try {
        const res = await axios.get(
          "https://www.googleapis.com/oauth2/v1/userinfo",
          {
            headers: {
              Authorization: `Bearer ${token.access_token}`,
            },
          }
        );
        providerData = res.data;
      } catch (err) {
        reply
          .code(500)
          .send({ message: "Something went wrong with the token" });
        return;
      }

      // TODO: Using findFirst but email should be unique as well and so using findUnique
      const user = await app.prisma.user.findUnique({
        where: { email: providerData.email },
      });

      // New user registration
      if (!user) {
        await app.prisma.user.create({
          data: {
            email: providerData.email,
            name: providerData.name,
            providerIdToken: token.id_token || "",
            // TODO: Not needed, remove
            providerAccessToken: token.access_token,
            provider: "google",
          },
        });
      }

      // Update user token
      await app.prisma.user.update({
        where: { email: providerData.email },
        data: {
          providerIdToken: token.id_token || "",
          providerAccessToken: token.access_token,
          provider: "google",
        },
      });

      // if later you need to refresh the token you can use
      // const { token: newToken } = await this.getNewAccessTokenUsingRefreshToken(token)

      reply.send({ access_token: token.access_token });
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
