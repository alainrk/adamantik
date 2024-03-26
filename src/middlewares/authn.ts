import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import jwtoken, { JwtPayload } from "jsonwebtoken";
import { DEFAULT_CIPHERS } from "tls";

declare module "fastify" {
  interface FastifyRequest {
    user: {
      id: number;
      email: string;
    };
  }
}

declare module "jsonwebtoken" {
  interface JwtPayload {
    email: string;
  }
}

export default function authenticationMiddleware(app: FastifyInstance) {
  // Decorate request with user data that will be set by the middleware
  app.decorateRequest("user", { id: 0, email: "" });

  return async (request: FastifyRequest, reply: FastifyReply) => {
    // Get bearer token from request
    const token = request.headers.authorization?.replace("Bearer ", "");
    if (!token) {
      reply.code(401).send({
        message: "Unauthorized, missing access token in the request.",
      });
      return;
    }

    let decodedToken: JwtPayload | null = null;
    try {
      decodedToken = jwtoken.verify(token, app.config.jwtSecret) as JwtPayload;
      if (!decodedToken) {
        throw new Error("Invalid token");
      }
    } catch (err) {
      reply.code(401).send({ message: "Unauthorized" });
    }

    const user = await app.prisma.user.findUnique({
      where: { email: decodedToken?.email },
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
