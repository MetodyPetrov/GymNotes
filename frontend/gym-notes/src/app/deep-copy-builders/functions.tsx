import { ExerciseModel, WorkoutModel } from '../types/Workout.types';

export function exercisesDeepCopy(list: ExerciseModel[]) {
  let newList: ExerciseModel[] = list.map((exercise) => ({
    ...exercise,
    tags: [...exercise.tags],
    sets: exercise.sets.map(set => ({ ...set }))
  }));

  return newList;
}

export function workoutsDeepCopy(list: WorkoutModel[]): WorkoutModel[] {
  return list.map((workout) => ({
    id: workout.id,
    exercises: exercisesDeepCopy(workout.exercises),
    dateCreated: workout.dateCreated
  }));
}
