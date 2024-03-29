import { FastifyInstance, FastifyRequest } from "fastify";
import { Prisma } from "@prisma/client";

// Maps total_weeks to number of sets for a given week
const MESO_MIN_WEEKS = 3;
const MESO_MAX_WEEKS = 8;
const RIR_MAP: Record<number, number[]> = {
  3: [1, 0, 8],
  4: [2, 1, 0, 8],
  5: [3, 2, 1, 0, 8],
  6: [3, 2, 2, 1, 0, 8],
  7: [3, 2, 2, 1, 1, 0, 8],
  8: [3, 3, 2, 2, 1, 1, 0, 8],
};

type GetMesocyclesRequest = FastifyRequest<{
  Querystring: { cursor?: number; take?: number };
}>;

type GetMesocycleRequest = FastifyRequest<{
  Params: { id: number };
}>;

type PostMesocycleRequestBody = {
  name: string;
  focus: string;
  numberOfWeeks: number;
  numberOfDays: number;
  template: {
    days: number[][];
  };
};

type PostMesocycleRequest = FastifyRequest<{
  Body: PostMesocycleRequestBody;
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

  app.post("/mesocycles", async (req: PostMesocycleRequest, res) => {
    // TODO: Stub implementation for now
    const id = await createMesocycle(app, +req.user.id, req.body);

    const mesocycle = await app.prisma.mesocycle.findUniqueOrThrow({
      where: { id },
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

    return mesocycle;
  });
}

// TODO: Stub implementation for now
// createMesocycle creates a new mesocycle including its empty weeks and workouts
async function createMesocycle(
  app: FastifyInstance,
  userId: number,
  body: PostMesocycleRequestBody
): Promise<number> {
  const mesocycle = await app.prisma.mesocycle.create({
    data: {
      userId,
      name: body.name,
      focus: body.focus,
      numberOfWeeks: body.numberOfWeeks,
      numberOfDays: body.numberOfDays,
      // TODO: Validate template especially about valid exerciseId
      template: JSON.stringify(body.template),
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
            expectedRir: getRIR(d, mesocycle.numberOfWeeks),
            feedback: `{ "soreness": 0, "recover": 0, "pain": 0 }`,
            sets: JSON.stringify(
              new Array(getNumberOfSets(d, mesocycle.numberOfWeeks)).fill(0)
            ),
          },
        });
      }
    }
  }

  return mesocycle.id;
}

function getRIR(weekNum: number, totalWeeks: number): number {
  if (totalWeeks < MESO_MIN_WEEKS || totalWeeks > MESO_MAX_WEEKS) {
    throw new Error("Invalid total weeks");
  }

  return RIR_MAP[totalWeeks][weekNum];
}

// TODO: This will be calculated at a later stage given the feeback on the preivous week and when starting this workout (end of the previous week), be default start with 2 sets at the first week implementation for now
function getNumberOfSets(weekNum: number, totalWeeks: number): number {
  if (weekNum === 0) return 2;
  return 0;
}
