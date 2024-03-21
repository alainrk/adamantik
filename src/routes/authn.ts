import { FastifyInstance } from "fastify";
import axios from "axios";

export default async function authn(app: FastifyInstance) {
  app.get("/login/google/callback", async function (request, reply) {
    const { token } =
      await app.googleOAuth2.getAccessTokenFromAuthorizationCodeFlow(request);

    let providerData = null;
    try {
      providerData = await app.idp.verifyUser(token.access_token);
    } catch (err) {
      reply.code(500).send({ message: "Something went wrong with the token" });
      return;
    }

    await app.prisma.user.upsert({
      where: { email: providerData.email },
      update: {
        providerIdToken: token.id_token || "",
        providerAccessToken: token.access_token,
        provider: "google",
      },
      create: {
        email: providerData.email,
        name: providerData.name,
        providerIdToken: token.id_token || "",
        providerAccessToken: token.access_token,
        provider: "google",
      },
    });

    // if later you need to refresh the token you can use
    // const { token: newToken } = await this.getNewAccessTokenUsingRefreshToken(token)

    reply.send({ access_token: token.access_token });
  });
}
