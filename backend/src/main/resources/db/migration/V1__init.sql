CREATE TABLE exercises (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    creator_user_id INTEGER,
    has_sets BOOLEAN,
    has_volume BOOLEAN,
    has_duration BOOLEAN,
    has_distance BOOLEAN
);

CREATE TABLE workouts (
    id SERIAL PRIMARY KEY,
    user_creator_id INTEGER,
    date_created TIMESTAMP
);

CREATE TABLE sets (
    id SERIAL PRIMARY KEY,
    workout_id INTEGER NOT NULL,
    exercise_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    "order" INTEGER,
    duration INTEGER,
    weight INTEGER,
    reps INTEGER,
    distance INTEGER,
    workout_date TIMESTAMP,
    CONSTRAINT fk_sets_workout FOREIGN KEY (workout_id) REFERENCES workouts(id),
    CONSTRAINT fk_sets_exercise FOREIGN KEY (exercise_id) REFERENCES exercises(id)
);

CREATE TABLE personal_statistics (
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
    total_kg_lifted INTEGER,
    total_workouts INTEGER,
    total_time_trained INTEGER,
    total_sets INTEGER
);

CREATE TABLE workout_exercises (
    workout_id INTEGER NOT NULL,
    exercise_id INTEGER NOT NULL,
    CONSTRAINT pk_workout_exercises PRIMARY KEY (workout_id, exercise_id),
    CONSTRAINT fk_workout_exercises_workout FOREIGN KEY (workout_id) REFERENCES workouts(id),
    CONSTRAINT fk_workout_exercises_exercise FOREIGN KEY (exercise_id) REFERENCES exercises(id)
);

CREATE TABLE workout_types (
    id SERIAL PRIMARY KEY,
    type VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE exercise_workout_types (
    exercise_id INTEGER NOT NULL,
    workout_type_id INTEGER NOT NULL,
    CONSTRAINT pk_exercise_workout_types PRIMARY KEY (exercise_id, workout_type_id),
    CONSTRAINT fk_exercise_workout_types_exercise FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON DELETE CASCADE,
    CONSTRAINT fk_exercise_workout_types_workout_type FOREIGN KEY (workout_type_id) REFERENCES workout_types(id) ON DELETE CASCADE
);