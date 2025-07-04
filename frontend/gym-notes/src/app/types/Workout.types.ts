import { Dayjs } from "dayjs";

export type ExerciseModel = {
  id: number
  name: string;
  tags: string[];
  sets: ExerciseSet[];
};

export type WorkoutModel = {
  id: number,
  exercises: ExerciseModel[],
  dateCreated: Dayjs
}

export type WorkoutProps = {
  id: number;
  exercises: ExerciseModel[];
  date: Dayjs;
  removeWorkout: (id:number) => void;
};

export type ExerciseSet = {
  volume: number | null;
  duration: number | null;
  reps: number | null;
  distance: number | null;
};

export type ExerciseProps = {
  id: number,
  name: string;
  sets: ExerciseSet[];
  editting?: string | boolean;
  deleteExercise?: () => void;
};