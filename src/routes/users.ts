import { FastifyInstance, FastifyRequest } from "fastify";

type UsersRequest = FastifyRequest<{
  Querystring: { cursor?: number; take?: number };
}>;

type UserRequest = FastifyRequest<{
  Params: { id: number };
}>;

export default async function users(app: FastifyInstance) {
  app.get("/users", async (req: UsersRequest, res) => {
    const { cursor, take } = req.query;
    const opts = {
      cursor: { id: Number(cursor) },
      skip: !!cursor ? 1 : 0,
      take: Number(take) || 10,
      orderBy: { id: "asc" },
    };
    // TODO: Solve these two TS issues
    // @ts-ignore
    if (!cursor) delete opts.cursor;
    // @ts-ignore
    const users = await app.prisma.user.findMany(opts);
    const newCursor = users[users.length - 1]?.id;
    return { users, cursor: newCursor };
  });

  app.get("/users/:id", async (req: UserRequest, res) => {
    const { id } = req.params;
    return await app.prisma.user.findUniqueOrThrow({
      where: { id: Number(id) },
    });
  });
}
