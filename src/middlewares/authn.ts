import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import jwtoken, { JwtPayload } from "jsonwebtoken";

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
    id: number;
    email: string;
  }
}

export default function authenticationMiddleware(app: FastifyInstance) {
  // Set default user data, it doesn't use decorate request because of FSTDEP006
  app.addHook("onRequest", async (req, _reply) => {
    req.user = { id: 0, email: "" };
  });

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
      decodedToken = jwtoken.verify(token, app.config.jwt.secret) as JwtPayload;
      if (!decodedToken) {
        throw new Error("Invalid token");
      }
    } catch (err) {
      reply.code(401).send({ message: "Unauthorized" });
    }

    // Decorate request with user data
    request.user.id = decodedToken?.id || 0;
    request.user.email = decodedToken?.email || "";
  };
}
