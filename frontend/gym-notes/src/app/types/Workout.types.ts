import { Dayjs } from "dayjs";

export type CommentModel = {
  owner: string;
  comment: string;
}

export type ExerciseModel = {
  id: number | string;
  name: string;
  tags: string[];
  sets: ExerciseSet[];
};

export type WorkoutModel = {
  id: number,
  likes: number;
  dislikes: number;
  hasLiked: boolean;
  hasDisliked: boolean;
  exercises: ExerciseModel[],
  dateCreated: Dayjs
}

export type WorkoutsListProps = {
  workouts: WorkoutModel[];
  personal: boolean;
  removeWorkout: (id: number) => void;
}

export type WorkoutProps = {
  id: number;
  likes: number;
  dislikes: number;
  hasLiked: boolean;
  hasDisliked: boolean;
  exercises: ExerciseModel[];
  date: Dayjs;
  personal: boolean;
  removeWorkout: (id:number) => void;
};

export type ExerciseProps = {
  first?: boolean;
  editWorkout?: (activate: boolean) => void;
  cancelEditWorkout?: () => void
  id: number | string,
  name: string;
  sets: ExerciseSet[];
  tags: string[];
  editting?: string | boolean;
  deleteExercise?: () => void;
  changeWorkoutTags?: (arr: string[], id: number | string, remove?: boolean | undefined) => void;
};

export type ExerciseSet = {
  volume: number | null;
  duration: number | null;
  reps: number | null;
  distance: number | null;
};

export type ExerciseTemplate = {
  name: string;
  tags: string[];
  reps: boolean;
  volume: boolean;
  distance: boolean;
  duration: boolean;
};