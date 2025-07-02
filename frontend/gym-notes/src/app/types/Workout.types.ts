export type ExerciseModel = {
  id: number
  name: string;
  tags: string[];
  sets: ExerciseSet[];
};

export type WorkoutModel = {
  exercises: ExerciseModel[]
}

export type WorkoutProps = {
  exercises: ExerciseModel[];
  removeWorkout: () => void;
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
  deleteExercise?: () => void;
};