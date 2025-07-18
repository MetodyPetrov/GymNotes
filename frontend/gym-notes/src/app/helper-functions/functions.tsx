import { ExerciseModel } from "../types/Workout.types";

export function compareExercises(first: ExerciseModel, second: ExerciseModel) {
    if(!first || !second) return false;
    if (first.id === second.id) return true;
    let sameName: boolean = first.name === second.name;

    const firstObject = first.tags.reduce<Record<string, number>>((acc, tag) => {
        acc[tag] = (acc[tag] || 0) + 1;
        return acc;
    }, {});
    const secondObject = second.tags.reduce<Record<string, number>>((acc, tag) => {
        acc[tag] = (acc[tag] || 0) + 1;
        return acc;
    }, {});

    for (const tag in firstObject) {
        if(firstObject[tag] !== secondObject[tag]) return false;
    }

    for(let i = 0; i < Math.max(first.sets.length, second.sets.length); i++) {
        if ( sameName &&
            first.sets[i].reps !== second.sets[i].reps ||
            first.sets[i].volume !== second.sets[i].volume ||
            first.sets[i].distance !== second.sets[i].distance ||
            first.sets[i].duration !== second.sets[i].duration
        ) return false;
    }

    return true;
}

export function compareWorkouts(first: ExerciseModel[], second: ExerciseModel[]) {
    for(let i = 0; i < Math.max(first.length, second.length); i++) {
        if(!compareExercises(first[i], second[i])) return false;
    }

    return true;
}

export function formatDuration(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const padded = (num: number) => String(num).padStart(2, '0');

  return `${padded(hrs)}:${padded(mins)}:${padded(secs)}`;
}
