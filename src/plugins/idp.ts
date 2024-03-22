import axios from "axios";

import fp from "fastify-plugin";
import {
  FastifyInstance,
  FastifyPluginCallback,
  FastifyRequest,
} from "fastify";
import oauthPlugin, {
  OAuth2Namespace,
  FastifyOAuth2Options,
  OAuth2Token,
} from "@fastify/oauth2";

declare module "fastify" {
  interface FastifyInstance {
    idp: IDP;
    // TODO: Maybe I don't want to expose it and provide its functionality in this idp module instead,
    // so routes/middlewares call me instead of dealing with the different providers in case I want to support multiple
    googleOAuth2: OAuth2Namespace;
  }
}

class IDP {
  provider: string;
  options: any;
  verifyUser: (accessToken: string) => Promise<any>;
  getAccessTokenFromRequest: (
    app: FastifyInstance,
    request: FastifyRequest
  ) => Promise<OAuth2Token>;

  constructor(provider: string = "google") {
    this.provider = provider;
    switch (provider) {
      case "google":
        this.verifyUser = this.verifyUserGoogle;
        this.getAccessTokenFromRequest = this.getAccessTokenFromRequestGoogle;
        break;
      default:
        throw new Error("Unsupported IDP");
    }
  }

  private async verifyUserGoogle(accessToken: string) {
    const res = await axios.get(
      "https://www.googleapis.com/oauth2/v1/userinfo",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return res.data;
  }

  private async getAccessTokenFromRequestGoogle(
    app: FastifyInstance,
    request: FastifyRequest
  ): Promise<OAuth2Token> {
    return app.googleOAuth2.getAccessTokenFromAuthorizationCodeFlow(request);
  }
}

const idp: FastifyPluginCallback = (app: FastifyInstance, _, done) => {
  // Initialize Prisma client
  const idp = new IDP(app.config?.auth?.provider);

  // Expose Prisma client within the Fastify object
  app.decorate("idp", idp);

  const oauthOpts: FastifyOAuth2Options = {
    name: "googleOAuth2",
    scope: ["profile", "email"],
    credentials: {
      client: {
        id: app.config?.auth?.clientId || "",
        secret: app.config?.auth?.clientSecret || "",
      },
      auth: oauthPlugin.GOOGLE_CONFIGURATION,
    },
    // Register a fastify url to start the redirect flow
    startRedirectPath: "/login/google",
    // Google will redirect here after the user login
    callbackUri: `http://${app.config.host}:${app.config.port}/login/google/callback`,
  };

  app.register(oauthPlugin, oauthOpts);

  // Call done to signal that plugin registration is complete
  done();
};

export default fp(idp);
