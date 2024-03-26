import { FastifyInstance } from "fastify";
import jwtoken from "jsonwebtoken";

export default async function authn(app: FastifyInstance) {
  app.get("/login/google/callback", async function (request, reply) {
    const { token } = await app.idp.getAccessTokenFromRequest(app, request);

    let providerData = null;
    try {
      providerData = await app.idp.verifyUser(token.access_token);
    } catch (err) {
      reply.code(500).send({ message: "Something went wrong with the token" });
      return;
    }

    // Create JWT token
    const jwt = jwtoken.sign(
      { email: providerData.email },
      app.config.jwtSecret
    );

    await app.prisma.user.upsert({
      where: { email: providerData.email },
      update: {
        provider: "google",
      },
      create: {
        email: providerData.email,
        name: providerData.name,
        provider: "google",
      },
    });

    reply.send({ token: jwt });
  });
}
