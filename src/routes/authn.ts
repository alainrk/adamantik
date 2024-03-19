import { FastifyInstance, FastifyRequest } from "fastify";
import axios from "axios";

export default async function authn(app: FastifyInstance) {
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
      reply.code(500).send({ message: "Something went wrong with the token" });
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
}
