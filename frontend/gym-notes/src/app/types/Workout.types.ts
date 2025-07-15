import { Dayjs } from "dayjs";

export type CommentModel = {
  id: string;
  ownerId: string;
  owner: string;
  comment: string;
}

export type ExerciseModel = {
  index: number;
  id: string;
  name: string;
  tags: string[];
  sets: ExerciseSet[];
};

export type WorkoutModel = {
  id: string,
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
  removeWorkout: (id: string) => void;
  fetchMoreWorkouts: () => void;
  dateFilter: Dayjs;
  setDateFilter: (date: Dayjs) => void;
  calendar: boolean;
  setCalendar: (value: boolean) => void;
  loading: boolean;
}

export type WorkoutProps = {
  id: string;
  likes: number;
  dislikes: number;
  hasLiked: boolean;
  hasDisliked: boolean;
  exercises: ExerciseModel[];
  date: Dayjs;
  personal: boolean;
  removeWorkout: (id: string) => void;
};

export type ExerciseProps = {
  first?: boolean;
  editWorkout?: (activate: boolean) => void;
  cancelEditWorkout?: () => void;
  id: string;
  newSetId: string;
  name: string;
  sets: ExerciseSet[];
  tags: string[];
  editting?: string | boolean;
  deleteExercise?: () => void;
  deleteSet?: (id: string) => void;
  addSet?: (exerciseId: string) => void;
  changeWorkoutTags?: (arr: string[], id: string, remove?: boolean | undefined) => void;
  incrementNewSetId: () => void;
};

export type ExerciseSet = {
  [key: string]: number | string |null;
  id: string;
  volume: number | null;
  duration: number | null;
  reps: number | null;
  distance: number | null;
};

export type ExerciseTemplate = {
  id: string;
  name: string;
  tags: string[];
  reps: boolean;
  volume: boolean;
  distance: boolean;
  duration: boolean;
};