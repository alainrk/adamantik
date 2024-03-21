import axios from "axios";

import fp from "fastify-plugin";
import { FastifyInstance, FastifyPluginCallback } from "fastify";

declare module "fastify" {
  interface FastifyInstance {
    idp: IDP;
  }
}

class IDP {
  provider: string;
  verifyUser: (accessToken: string) => Promise<any>;

  constructor(provider: string = "google") {
    this.provider = provider;
    switch (provider) {
      case "google":
        this.verifyUser = this.verifyUserGoogle;
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
}

const idp: FastifyPluginCallback = (app: FastifyInstance, _, done) => {
  // Initialize Prisma client
  const idp = new IDP(app.config?.auth?.provider);

  // Expose Prisma client within the Fastify object
  app.decorate("idp", idp);

  // Call done to signal that plugin registration is complete
  done();
};

export default fp(idp);
