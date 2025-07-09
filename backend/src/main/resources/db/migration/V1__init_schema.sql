CREATE TABLE exercises (
    id SERIAL PRIMARY KEY,
    name           VARCHAR(255) NOT NULL UNIQUE,
    creator_user_id        UUID,
    has_reps       BOOLEAN,
    has_volume     BOOLEAN,
    has_duration   BOOLEAN,
    has_distance   BOOLEAN
);

CREATE TABLE workouts (
    id             SERIAL PRIMARY KEY,
    creator_user_id        UUID,
    date_created   TIMESTAMP
);

CREATE TABLE sets (
    id             SERIAL PRIMARY KEY,
    workout_id     INTEGER NOT NULL REFERENCES workouts(id),
    exercise_id    INTEGER NOT NULL REFERENCES exercises(id),
    duration       INTEGER,
    weight         INTEGER,
    reps           INTEGER,
    distance       INTEGER
);

CREATE TABLE personal_statistics (
    id                 SERIAL PRIMARY KEY,
    user_id            UUID,
    total_kg_lifted    INTEGER,
    total_workouts     INTEGER,
    total_time_trained INTEGER,
    total_sets         INTEGER
);

CREATE TABLE workout_types (
    id   SERIAL PRIMARY KEY,
    type VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE exercise_workout_types (
    exercise_id      INTEGER NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
    workout_type_id  INTEGER NOT NULL REFERENCES workout_types(id) ON DELETE CASCADE,
    PRIMARY KEY (exercise_id, workout_type_id)
);

INSERT INTO workout_types (type) VALUES
  ('CHEST'),
  ('BACK'),
  ('LEGS'),
  ('BICEP'),
  ('TRICEP'),
  ('SHOULDERS'),
  ('CARDIO');