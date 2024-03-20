import { FastifyInstance, FastifyRequest } from "fastify";
import { Prisma } from "@prisma/client";

type UsersRequest = FastifyRequest<{
  Querystring: { cursor?: number; take?: number };
}>;

type UserRequest = FastifyRequest<{
  Params: { id: number };
}>;

export default async function users(app: FastifyInstance) {
  app.get("/users", async (req: UsersRequest, res) => {
    const { cursor, take } = req.query;
    const select: Prisma.UserSelect = {
      name: true,
      email: true,
      createdAt: true,
    };
    const opts: Prisma.UserFindManyArgs = {
      take: Number(take) || 10,
      orderBy: { id: "asc" },
      select,
    };
    if (cursor) {
      opts.cursor = { id: Number(cursor) };
      opts.skip = !!cursor ? 1 : 0;
    }
    const users = await app.prisma.user.findMany(opts);
    const newCursor = users[users.length - 1]?.id;
    return { users, cursor: newCursor };
  });

  app.get("/users/:id", async (req: UserRequest, res) => {
    const { id } = req.params;
    const select: Prisma.UserSelect = {
      name: true,
      email: true,
      createdAt: true,
    };
    return await app.prisma.user.findUniqueOrThrow({
      where: { id: Number(id) },
      select,
    });
  });
}
