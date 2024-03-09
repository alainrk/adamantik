CREATE TABLE IF NOT EXISTS user (
  id INTEGER PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT,
  email TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS mesocycle_template (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  user_id INTEGER, -- NULL for global templates
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  template TEXT NOT NULL, -- JSON with template week by week
  FOREIGN KEY (user_id) REFERENCES user(id)
);

CREATE TABLE IF NOT EXISTS mesocycle (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  template TEXT NOT NULL, -- JSON with template week by week
  FOREIGN KEY (user_id) REFERENCES user(id)
);

CREATE TABLE IF NOT EXISTS exercise (
  id INTEGER PRIMARY KEY,
  muscle_group INTEGER NOT NULL, -- Enum
  name TEXT NOT NULL,
  video_url TEXT,
  user_id INTEGER, -- NULL for global exercises
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);