/// <reference path="./global.d.ts" />
import { Entities } from "@platformatic/sql-mapper";
import {
  Mesocycle,
  MesocycleTemplate,
  User,
  Exercise,
  ExerciseInstance,
  Week,
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
const MUSCLE_GROUP_TRAPS = 13;

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
    numberOfDays: 3,
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
    numberOfDays: 2,
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
    focus: "fullbody",
    numberOfWeeks: 3,
    numberOfDays: 2,
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
    numberOfDays: 4,
    focus: "strength",
    name: "Bench press prep 2024",
    template: JSON.stringify({
      days: [[1], [3], [2], [1]],
    }),
  },
  {
    id: 3,
    userId: 2,
    numberOfWeeks: 3,
    numberOfDays: 4,
    focus: "strength",
    name: "Bench press prep 2025",
    template: JSON.stringify({
      days: [[1], [1], [1, 2, 3], [1]],
    }),
  },
];

// Define a function that given a list of objects, returns a list of objects
// with the same structure but with an additional property.
const weeks: Week[] = ((mesos: Mesocycle[]): Week[] => {
  const weeks: Week[] = [];
  let c = 0;
  for (const meso of mesos) {
    for (let i = 0; i < meso.numberOfWeeks; i++) {
      c++;
      weeks.push({
        // @ts-ignore-next-line
        _template: JSON.parse(meso.template), // Just to then internally keep it for convenience later
        numberOfDays: meso.numberOfDays,
        id: c,
        relativeOrder: i,
        mesocycleId: meso.id || 0,
        completedAt: null,
      });
    }
  }
  return weeks;
})(mesocycles);

const workouts: Workout[] = ((weeks: Week[]): Workout[] => {
  const workouts: Workout[] = [];
  let c = 0;
  for (const week of weeks) {
    // @ts-ignore-next-line
    for (let i = 0; i < week._template.days.length; i++) {
      c++;
      workouts.push({
        // @ts-ignore-next-line
        _template: week._template,
        id: c,
        relativeOrder: i,
        weekId: week.id || 0,
        completedAt: null,
      });
    }
  }
  return workouts;
})(weeks);

const exerciseInstances: ExerciseInstance[] = ((
  workouts: Workout[]
): ExerciseInstance[] => {
  const exerciseInstances: ExerciseInstance[] = [];
  let c = 0;

  // TODO: This will eventually be in the week (or at most workout) instead
  const expectedRir = Math.floor(Math.random() * 4); // 0..3
  for (const workout of workouts) {
    // @ts-ignore-next-line
    const template = workout._template;

    for (let i = 0; i < template.days[workout.relativeOrder].length; i++) {
      c++;

      const weight = Math.floor(Math.random() * 100) + 10;
      const soreness = Math.floor(Math.random() * 3); // 0..2
      const recover = Math.floor(Math.random() * 3); // 0..2
      const pain = Math.floor(Math.random() * 3) + 1; // 0..2
      const sets = [Math.floor(Math.random() * 5) + 1]; // 1..5
      for (let i = 1; i < Math.floor(Math.random() * 4) + 1; i++) {
        // Avoid going below 1
        sets.push(Math.max(1, sets[i - 1] - Math.floor(Math.random() * 3)));
      }

      exerciseInstances.push({
        id: c,
        relativeOrder: i,
        exerciseId: template.days[workout.relativeOrder][i],
        workoutId: workout.id || 0,
        weight,
        expectedRir,
        feedback: `{ "soreness": ${soreness}, "recover": ${recover}, "pain": ${pain} }`,
        sets: JSON.stringify(sets),
      });
    }
  }
  return exerciseInstances;
})(workouts);

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
    // @ts-ignore-next-line
    delete week._template;
    await opts.entities.week.save({ input: week });
  }
  for (const workout of workouts) {
    // @ts-ignore-next-line
    delete workout._template;
    await opts.entities.workout.save({ input: workout });
  }
  for (const exerciseInstance of exerciseInstances) {
    await opts.entities.exerciseInstance.save({ input: exerciseInstance });
  }
}
