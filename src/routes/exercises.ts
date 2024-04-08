import { FastifyInstance, FastifyRequest } from "fastify";
import { Prisma } from "@prisma/client";

type GetExercisesRequest = FastifyRequest<{
  Querystring: { cursor?: number; take?: number };
}>;

type GetExerciseRequest = FastifyRequest<{
  Params: { id: number };
}>;

export default async function exercises(app: FastifyInstance) {
  app.get("/exercises", async (req: GetExercisesRequest, res) => {
    const { cursor, take } = req.query;
    const opts: Prisma.ExerciseFindManyArgs = {
      take: Number(take) || 50,
      orderBy: { id: "asc" },
    };
    if (cursor) {
      opts.cursor = { id: Number(cursor) };
      opts.skip = !!cursor ? 1 : 0;
    }

    // Filter only mine or publicly available exercises
    opts.where = {
      OR: [{ userId: req.user.id }, { userId: null }],
    };

    const exercises = await app.prisma.exercise.findMany(opts);
    const newCursor = exercises[exercises.length - 1]?.id;
    return { exercises, cursor: newCursor };
  });

  app.get("/exercises/:id", async (req: GetExerciseRequest, res) => {
    const exercise = await app.prisma.exercise.findUniqueOrThrow({
      where: { id: +req.params.id },
    });

    // Only get if mine or publicly available exercises
    if (exercise.userId !== null && exercise.userId !== req.user.id) {
      res.code(401).send({ message: "Unauthorized" });
      return;
    }

    return exercise;
  });
}
