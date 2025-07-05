import { Dayjs } from "dayjs";

export type ExerciseModel = {
  id: number | string;
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
  id: number | string,
  name: string;
  sets: ExerciseSet[];
  editting?: string | boolean;
  deleteExercise?: () => void;
  changeWorkoutTags?: (arr: string[], id: number | string, remove?: boolean | undefined) => void;
};

export type ExerciseTemplate = {
  name: string;
  tags: string[];
  reps: boolean;
  volume: boolean;
  distance: boolean;
  duration: boolean;
};