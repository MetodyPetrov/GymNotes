CREATE TABLE exercises (
    id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    name             VARCHAR(255) NOT NULL UNIQUE,
    creator_user_id  UUID,
    has_reps         BOOLEAN,
    has_volume       BOOLEAN,
    has_duration     BOOLEAN,
    has_distance     BOOLEAN
);

CREATE TABLE workouts (
    id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_user_id  UUID,
    date_created     TIMESTAMP   DEFAULT now()
);

CREATE TABLE sets (
    id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    workout_id    UUID        NOT NULL REFERENCES workouts(id) ON DELETE CASCADE,
    exercise_id   UUID        NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
    duration      INTEGER,
    weight        INTEGER,
    reps          INTEGER,
    distance      INTEGER,
    exercise_index INTEGER NOT NULL
);

CREATE TABLE personal_statistics (
    id                  UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID NOT NULL,
    total_kg_lifted     INTEGER,
    total_workouts      INTEGER,
    total_time_trained  INTEGER,
    total_sets          INTEGER
);

CREATE TABLE workout_types (
    id   UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    type VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE exercise_workout_types (
    exercise_id     UUID NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
    workout_type_id UUID NOT NULL REFERENCES workout_types(id) ON DELETE CASCADE,
    PRIMARY KEY (exercise_id, workout_type_id)
);

INSERT INTO workout_types (id, type) VALUES
  (gen_random_uuid(), 'CHEST'),
  (gen_random_uuid(), 'BACK'),
  (gen_random_uuid(), 'LEGS'),
  (gen_random_uuid(), 'ARMS'),
  (gen_random_uuid(), 'ABS'),
  (gen_random_uuid(), 'CARDIO');
