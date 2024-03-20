import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import axios from "axios";

export default function authenticationMiddleware(app: FastifyInstance) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    // Get bearer token from request
    const access_token = request.headers.authorization?.replace("Bearer ", "");
    if (!access_token) {
      reply.code(401).send({
        message: "Unauthorized, missing access token in the request.",
      });
      return;
    }

    // Verify with the provider
    let providerData = null;
    try {
      const res = await axios.get(
        "https://www.googleapis.com/oauth2/v1/userinfo",
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      providerData = res.data;
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

    app.log.info({ user });
  };
}
