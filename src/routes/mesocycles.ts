import { FastifyInstance, FastifyRequest } from "fastify";
import { Prisma } from "@prisma/client";

type GetMesocyclesRequest = FastifyRequest<{
  Querystring: { cursor?: number; take?: number };
}>;

type GetMesocycleRequest = FastifyRequest<{
  Params: { id: number };
}>;

export default async function mesocycles(app: FastifyInstance) {
  app.get("/mesocycles", async (req: GetMesocyclesRequest, res) => {
    const { cursor, take } = req.query;
    const opts: Prisma.MesocycleFindManyArgs = {
      take: Number(take) || 10,
      orderBy: { id: "asc" },
      include: {
        weeks: {
          include: {
            workouts: {
              include: { exerciseInstances: true },
            },
          },
        },
      },
    };
    if (cursor) {
      opts.cursor = { id: Number(cursor) };
      opts.skip = !!cursor ? 1 : 0;
    }

    // Only get mine
    opts.where = { userId: req.user.id };

    const mesocycles = await app.prisma.mesocycle.findMany(opts);
    const newCursor = mesocycles[mesocycles.length - 1]?.id;
    return { mesocycles, cursor: newCursor };
  });

  app.get("/mesocycles/:id", async (req: GetMesocycleRequest, res) => {
    const mesocycle = await app.prisma.mesocycle.findUniqueOrThrow({
      where: { id: +req.params.id },
      include: {
        weeks: {
          include: {
            workouts: {
              include: { exerciseInstances: true },
            },
          },
        },
      },
    });

    if (mesocycle.userId !== req.user.id) {
      res.code(401).send({ message: "Unauthorized" });
      return;
    }

    return mesocycle;
  });

  app.post("/mesocycles", async (req: FastifyRequest, res) => {
    const { name } = req.body as {
      name: string;
    };

    const mesocycle = await app.prisma.mesocycle.create({
      data: {
        userId: +req.user.id,
        name,
        focus: "strength",
        numberOfWeeks: 5,
        numberOfDays: 4,
        template: JSON.stringify({
          days: [
            [1, 2],
            [1, 2],
            [2, 3],
          ],
        }),
      },
    });

    // Artificially also create all the weeks and workouts
    for (let i = 0; i < mesocycle.numberOfWeeks; i++) {
      const week = await app.prisma.week.create({
        data: {
          mesocycleId: mesocycle.id,
          numberOfDays: mesocycle.numberOfDays,
          relativeOrder: i,
          userId: mesocycle.userId,
        },
      });

      // Create workouts
      let c = -1;
      for (const day of JSON.parse(mesocycle.template).days) {
        c++;
        const workout = await app.prisma.workout.create({
          data: {
            relativeOrder: c,
            weekId: week.id,
            userId: mesocycle.userId,
          },
        });

        // Create exercise instances
        let d = -1;
        for (const exerciseId of day) {
          d++;
          await app.prisma.exerciseInstance.create({
            data: {
              relativeOrder: d,
              exerciseId,
              workoutId: workout.id,
              weight: 0,
              expectedRir: 1, // TODO: Precalc based on number of weeks
              feedback: `{ "soreness": 0, "recover": 0, "pain": 0 }`,
              sets: JSON.stringify([1]), // TODO: Precalc based on number of weeks
            },
          });
        }
      }
    }

    return mesocycle;
  });
}
