/// <reference path="./global.d.ts" />
import { Entities } from "@platformatic/sql-mapper";

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

const users: object[] = [
  {
    id: 1,
    first_name: "John",
    last_name: "Doe",
    email: "john.doe@example.com",
  },
  {
    id: 2,
    first_name: "Jane",
    last_name: "Smith",
    email: "jane.smith@example.com",
  },
];

const exercises: object[] = [
  {
    id: 1,
    muscle_group: MUSCLE_GROUP_QUADS,
    name: "High Bar Squat",
    video_url: "https://www.youtube.com/watch?v=i7J5h7BJ07g",
    user_id: null,
  },
  {
    id: 2,
    muscle_group: MUSCLE_GROUP_CHEST,
    name: "Bench Press (Wide Grip)",
    video_url: "https://www.youtube.com/watch?v=EeE3f4VWFDo",
    user_id: null,
  },
  {
    id: 3,
    muscle_group: MUSCLE_GROUP_BACK,
    name: "Pulldown (Normal Grip)",
    video_url: "https://www.youtube.com/watch?v=EUIri47Epcg",
    user_id: null,
  },
];

const mesocycleTemplates: object[] = [
  {
    id: 1,
    name: "Strength Training General",
    focus: "strength",
    user_id: null,
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
    user_id: 1, // Private template of user 1
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

const weekTemplates: object[] = [
  {
    id: 1,
    mesocycle_template_id: 1,
    template:
      '{"day1": [{"exercise_id": 1, "sets": {"sets": 4, "reps": 6}, "weight": 100, "expected_rir": 2}], "day2": []}',
  },
];

const mesocycles: object[] = [
  {
    id: 1,
    user_id: 1,
    name: "First Mesocycle",
    template:
      '{"week1": {"day1": [{"exercise_id": 1, "sets": {"sets": 4, "reps": 6}, "weight": 100, "expected_rir": 2}], "day2": []}}',
  },
];

const weeks: object[] = [
  {
    id: 1,
    mesocycle_id: 1,
    completed_at: null,
  },
];

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
  for (const weekTemplate of weekTemplates) {
    await opts.entities.weekTemplate.save({ input: weekTemplate });
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
