ALTER TABLE workouts
  ADD COLUMN likes    INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN dislikes INTEGER NOT NULL DEFAULT 0;

CREATE TABLE user_likes (
  id         UUID      PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID      NOT NULL,
  is_liked   BOOLEAN   NOT NULL,
  workout_id UUID      NOT NULL
    REFERENCES workouts(id)
    ON DELETE CASCADE,
  CONSTRAINT uq_user_likes_user_workout UNIQUE (user_id, workout_id)
);

CREATE TABLE comments (
  id         UUID      PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID      NOT NULL,
  message    TEXT      NOT NULL,
  workout_id UUID      NOT NULL
    REFERENCES workouts(id)
    ON DELETE CASCADE
);