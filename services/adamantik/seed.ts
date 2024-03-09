/// <reference path="./global.d.ts" />
import { Entities } from "@platformatic/sql-mapper";

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
    muscle_group: 1,
    name: "Squats",
    video_url: "https://www.example.com/squats",
    user_id: null,
  },
  {
    id: 2,
    muscle_group: 2,
    name: "Bench Press",
    video_url: "https://www.example.com/benchpress",
    user_id: null,
  },
];

const mesocycleTemplates: object[] = [
  {
    id: 1,
    name: "Strength Training",
    focus: "strength",
    user_id: null,
    template:
      '{"week1": {"day1": [{"exercise_id": 1, "sets": {"sets": 4, "reps": 6}, "weight": 100, "expected_rir": 2}], "day2": []}}',
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
