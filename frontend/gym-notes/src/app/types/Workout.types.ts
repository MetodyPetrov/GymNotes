export type ExerciseModel = {
  id: number
  name: string;
  tags: string[];
  sets: ExerciseSet[];
};

export type WorkoutModel = {
  id: number,
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
  id: number,
  name: string;
  sets: ExerciseSet[];
  editting?: boolean;
  deleteExercise?: () => void;
};