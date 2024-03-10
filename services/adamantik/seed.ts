/// <reference path="./global.d.ts" />
import { Entities } from "@platformatic/sql-mapper";
import {
  Mesocycle,
  MesocycleTemplate,
  User,
  Exercise,
  ExerciseInstance,
  Week,
  WeekTemplate,
  Workout,
} from "./types";

const MUSCLE_GROUP_CHEST = 1;
const MUSCLE_GROUP_ABS = 2;
const MUSCLE_GROUP_BACK = 3;
const MUSCLE_GROUP_TRAPS_SHOULDERS = 4;
const MUSCLE_GROUP_FOREARMS = 5;
const MUSCLE_GROUP_CORE = 6;
const MUSCLE_GROUP_CALVES = 7;
const MUSCLE_GROUP_GLUTES = 8;
const MUSCLE_GROUP_HAMSTRINGS = 9;
const MUSCLE_GROUP_QUADS = 10;
const MUSCLE_GROUP_TRICEPS = 11;
const MUSCLE_GROUP_BICEPS = 12;

const users: User[] = [
  {
    id: 1,
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
  },
  {
    id: 2,
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@example.com",
  },
];

const exercises: Exercise[] = [
  {
    id: 1,
    muscleGroup: MUSCLE_GROUP_QUADS,
    name: "High Bar Squat",
    videoUrl: "https://www.youtube.com/watch?v=i7J5h7BJ07g",
    userId: null,
  },
  {
    id: 2,
    muscleGroup: MUSCLE_GROUP_CHEST,
    name: "Bench Press (Wide Grip)",
    videoUrl: "https://www.youtube.com/watch?v=EeE3f4VWFDo",
    userId: null,
  },
  {
    id: 3,
    muscleGroup: MUSCLE_GROUP_BACK,
    name: "Pulldown (Normal Grip)",
    videoUrl: "https://www.youtube.com/watch?v=EUIri47Epcg",
    userId: null,
  },
];

const mesocycleTemplates: MesocycleTemplate[] = [
  {
    id: 1,
    name: "Strength Training General",
    focus: "strength",
    userId: null,
    template: JSON.stringify({
      days: [
        // Exercise IDs for Day 1
        [1, 2],
        // Exercise IDs for Day 2
        [1, 2],
        // Exercise IDs for Day 3
        [2, 3],
      ],
    }),
  },
  {
    id: 2,
    name: "Bodydbuilding Full Body",
    focus: "fullbody",
    userId: 1, // Private template of user 1
    template: JSON.stringify({
      days: [
        // Exercise IDs for Day 1
        [1, 2],
        // Exercise IDs for Day 2
        [2, 3],
      ],
    }),
  },
];

const mesocycles: Mesocycle[] = [
  {
    id: 1,
    userId: 1,
    name: "Bodybuilding Winter 2024",
    numberOfWeeks: 3,
    template: JSON.stringify({
      days: [
        [1, 2],
        [2, 3],
      ],
    }),
  },
  {
    id: 2,
    userId: 2,
    numberOfWeeks: 3,
    name: "Bench press prep 2024",
    template: JSON.stringify({
      days: [[1], [3], [2], [1]],
    }),
  },
  {
    id: 3,
    userId: 2,
    numberOfWeeks: 3,
    name: "Bench press prep 2025",
    template: JSON.stringify({
      days: [[1], [1], [1, 2, 3], [1]],
    }),
  },
];

// Define a function that given a list of objects, returns a list of objects
// with the same structure but with an additional property.
const weeks: Week[] = ((mesos: Mesocycle[]): Week[] => {
  const weeks = [];
  for (const meso of mesos) {
    for (let i = 0; i < meso.numberOfWeeks; i++) {
      weeks.push({
        id: i + 1,
        relative_order: i,
        mesocycle_id: meso.id,
        completed_at: null,
      });
    }
  }
  return weeks;
})(mesocycles);

const workouts: object[] = [
  {
    id: 1,
    relative_order: 1,
    week_id: 1,
    completed_at: null,
  },
];

const exerciseInstances: object[] = [
  {
    id: 1,
    relative_order: 1,
    exercise_id: 1,
    workout_id: 1,
    weight: 100,
    expected_rir: 2,
    feedback: "{}",
    sets: '{"sets": 4, "reps": 6}',
  },
];

export async function seed(opts: { entities: Entities }) {
  for (const user of users) {
    await opts.entities.user.save({ input: user });
  }
  for (const exercise of exercises) {
    await opts.entities.exercise.save({ input: exercise });
  }
  for (const mesocycleTemplate of mesocycleTemplates) {
    await opts.entities.mesocycleTemplate.save({ input: mesocycleTemplate });
  }
  for (const mesocycle of mesocycles) {
    await opts.entities.mesocycle.save({ input: mesocycle });
  }
  for (const week of weeks) {
    await opts.entities.week.save({ input: week });
  }
  for (const workout of workouts) {
    await opts.entities.workout.save({ input: workout });
  }
  for (const exerciseInstance of exerciseInstances) {
    await opts.entities.exerciseInstance.save({ input: exerciseInstance });
  }
}
