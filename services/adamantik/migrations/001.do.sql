CREATE TABLE IF NOT EXISTS user (
  id INTEGER PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT,
  email TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS exercise (
  id INTEGER PRIMARY KEY,
  muscle_group INTEGER NOT NULL, -- Enum
  name TEXT NOT NULL,
  video_url TEXT,
  user_id INTEGER, -- NULL for global exercises
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS mesocycle_template (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  focus TEXT NOT NULL, -- Enum for target focus (e.g. strength, general hypertrophy, bench, muscle group...)
  user_id INTEGER, -- NULL for global templates
  number_of_days INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  template TEXT NOT NULL, -- JSON with template week by week
  FOREIGN KEY (user_id) REFERENCES user(id)
);

-- Actual mesocycle instance
CREATE TABLE IF NOT EXISTS mesocycle (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  focus TEXT NOT NULL, -- Enum for target focus (e.g. strength, general hypertrophy, bench, muscle group...)
  number_of_weeks INTEGER NOT NULL, -- Planned number of weeks for the mesocycle
  number_of_days INTEGER NOT NULL, -- Planned number of days for the mesocycle
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  template TEXT NOT NULL, -- JSON with template week by week
  FOREIGN KEY (user_id) REFERENCES user(id)
);

-- Actual week instance
-- On the 1st week created from template
-- From then on, the week is created from the previous week
CREATE TABLE IF NOT EXISTS week (
  id INTEGER PRIMARY KEY,
  number_of_days INTEGER NOT NULL, -- Planned number of days for the week
  relative_order INTEGER NOT NULL, -- Week number in the mesocycle (< mesocycle.number_of_weeks)
  mesocycle_id INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP,
  FOREIGN KEY (mesocycle_id) REFERENCES mesocycle(id)
);

-- Actual workout instance
-- On the 1st workout created from template
-- From then on, the workout is created from the previous week for that workout
CREATE TABLE IF NOT EXISTS workout (
  id INTEGER PRIMARY KEY,
  relative_order INTEGER NOT NULL, -- Order of the workout in the week
  week_id INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP,
  FOREIGN KEY (week_id) REFERENCES week(id)
);

CREATE TABLE IF NOT EXISTS exercise_instance (
  id INTEGER PRIMARY KEY,
  relative_order INTEGER NOT NULL, -- Order of the exercise in the workout
  exercise_id INTEGER NOT NULL,
  workout_id INTEGER NOT NULL,
  weight INTEGER NOT NULL, -- Weight for the entire exercise this day (i.e. downsets are separate exercise instances)
  expected_rir INTEGER NOT NULL, -- RIR for the exercise this day [TODO: Put this in the week or workout instead?]
  feedback TEXT NOT NULL, -- JSON with feedback for the exercise this day
  sets TEXT, -- JSON with Sets x Reps for the exercise this day
  FOREIGN KEY (exercise_id) REFERENCES exercise(id),
  FOREIGN KEY (workout_id) REFERENCES workout(id)
);
