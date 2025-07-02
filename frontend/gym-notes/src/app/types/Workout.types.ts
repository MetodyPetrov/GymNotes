export type ExerciseModel = {
  name: string;
  tags: string[];
  sets: ExerciseSet[];
};

export type WorkoutProps = {
  exercises: ExerciseModel[];
};

export type ExerciseSet = {
  volume?: number;
  duration?: number;
  reps?: number;
};

export type ExerciseProps = {
  name: string;
  sets: ExerciseSet[];
  editting?: boolean;
};