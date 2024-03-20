import { FastifyInstance } from "fastify";
import axios, { Axios, AxiosError } from "axios";

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

  app.get("/login/test", async function (request, reply) {
    // Get bearer token from request
    const access_token = request.headers.authorization?.replace("Bearer ", "");
    if (!access_token) {
      reply
        .code(401)
        .send({
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

    // Decorating request with user data taken from the database
    const user = await app.prisma.user.findUnique({
      where: { email: providerData.email },
      select: { id: true, name: true, email: true },
    });

    reply.send({ test: "OK", user });
  });
}
