import { FastifyInstance, FastifyRequest } from "fastify";
import { Prisma } from "@prisma/client";

type GetWorkoutsRequest = FastifyRequest<{
  Querystring: { cursor?: number; take?: number };
}>;

type GetWorkoutRequest = FastifyRequest<{
  Params: { id: number };
}>;

export default async function workouts(app: FastifyInstance) {
  app.get("/workouts", async (req: GetWorkoutsRequest, res) => {
    const { cursor, take } = req.query;
    const opts: Prisma.WorkoutFindManyArgs = {
      take: Number(take) || 10,
      orderBy: { id: "asc" },
    };
    if (cursor) {
      opts.cursor = { id: Number(cursor) };
      opts.skip = !!cursor ? 1 : 0;
    }

    // Only get mine
    opts.where = { userId: req.user.id };

    const workouts = await app.prisma.workout.findMany(opts);
    const newCursor = workouts[workouts.length - 1]?.id;
    return { workouts, cursor: newCursor };
  });

  app.get("/workouts/:id", async (req: GetWorkoutRequest, res) => {
    const workout = await app.prisma.workout.findUniqueOrThrow({
      where: { id: +req.params.id },
    });

    if (workout.userId !== req.user.id) {
      res.code(401).send({ message: "Unauthorized" });
      return;
    }

    return workout;
  });
}
