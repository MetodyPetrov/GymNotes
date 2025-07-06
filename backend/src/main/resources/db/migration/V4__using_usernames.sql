ALTER TABLE exercises
    RENAME COLUMN creator_user_id TO creator_username;

ALTER TABLE sets
    RENAME COLUMN user_id TO username;

ALTER TABLE workouts
    RENAME COLUMN user_creator_id TO creator_username;

ALTER TABLE personal_statistics
    RENAME COLUMN user_id TO username;