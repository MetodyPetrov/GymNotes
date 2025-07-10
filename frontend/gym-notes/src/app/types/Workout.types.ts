import { Dayjs } from "dayjs";

export type CommentModel = {
  id: number;
  ownerId: number;
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
  exercises: ExerciseModel[];
  dateCreated: Dayjs;
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
  cancelEditWorkout?: () => void;
  id: number | string;
  newSetId: string;
  name: string;
  sets: ExerciseSet[];
  tags: string[];
  editting?: string | boolean;
  deleteExercise?: () => void;
  deleteSet?: (id: string | number) => void;
  addSet?: (exerciseId: number | string) => void;
  changeWorkoutTags?: (arr: string[], id: number | string, remove?: boolean | undefined) => void;
  incrementNewSetId: () => void;
};

export type ExerciseSet = {
  [key: string]: number | string |null;
  id: number | string;
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