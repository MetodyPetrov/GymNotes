ALTER TABLE exercises
    DROP COLUMN has_sets,
    ADD COLUMN has_reps BOOLEAN;

ALTER TABLE exercises
    ALTER COLUMN creator_user_id TYPE VARCHAR(255) USING creator_user_id::VARCHAR;

ALTER TABLE workouts
    ALTER COLUMN user_creator_id TYPE VARCHAR(255) USING user_creator_id::VARCHAR;

ALTER TABLE sets
    ALTER COLUMN user_id TYPE VARCHAR(255) USING user_id::VARCHAR;

ALTER TABLE personal_statistics
    ALTER COLUMN user_id TYPE VARCHAR(255) USING user_id::VARCHAR;