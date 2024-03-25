import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import axios from "axios";

declare module "fastify" {
  interface FastifyRequest {
    user: {
      id: number;
      email: string;
    };
  }
}

export default function authenticationMiddleware(app: FastifyInstance) {
  // Decorate request with user data that will be set by the middleware
  app.decorateRequest("user", { id: 0, email: "" });

  return async (request: FastifyRequest, reply: FastifyReply) => {
    // Get bearer token from request
    const access_token = request.headers.authorization?.replace("Bearer ", "");
    if (!access_token) {
      reply.code(401).send({
        message: "Unauthorized, missing access token in the request.",
      });
      return;
    }

    let providerData = null;
    try {
      providerData = await app.idp.verifyUser(access_token);
    } catch (err) {
      app.log.error(err);
      if (axios.isAxiosError(err)) {
        if (err?.response?.status === 401) {
          reply.code(401).send({ message: "Unauthorized" });
          return;
        }
        reply.code(500).send({ message: "Error authenticating user" });
      }
    }

    //  TODO: Decorate request with user data taken from the database if necessary
    const user = await app.prisma.user.findUnique({
      where: { email: providerData.email },
      select: { id: true, name: true, email: true },
    });

    if (!user) {
      reply.code(401).send({ message: "Unauthorized" });
      return;
    }

    // Decorate request with user data
    request.user.id = user.id;
    request.user.email = user.email;

    app.log.info({ user });
  };
}
