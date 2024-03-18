import { FastifyInstance, FastifyRequest } from "fastify";
import { PrismaClient } from "@prisma/client";
import { User } from "../../types";

// TODO: Initialize globally in fastify (I suppose)
const prisma = new PrismaClient();

// Example curl:
// curl -X GET "http://localhost:3000/users?cursor=1&take=2"
type UsersRequest = FastifyRequest<{
  Querystring: { cursor?: number; take?: number };
}>;

type UserRequest = FastifyRequest<{
  Params: { id: number };
}>;

export default async function users(app: FastifyInstance) {
  app.get("/users", async (req: UsersRequest, res) => {
    const { cursor, take } = req.query;
    app.log.info(`Porco dio ${cursor}, ${take}`);
    const users = await prisma.user.findMany({
      cursor: { id: cursor ? Number(cursor) : 0 },
      skip: cursor ? 1 : 0,
      take: Number(take) || 10,
      orderBy: { id: "asc" },
    });
    const newCursor = users[users.length - 1]?.id;
    return { users, newCursor };
  });

  app.get("/users/:id", async (req: UserRequest, res) => {
    const { id } = req.params;
    return prisma.user.findUniqueOrThrow({
      where: { id: Number(id) },
    });
  });
}
