'use client'

import { useState } from 'react';
import Workout from '../components/Workout';
import WorkoutTemplate from '../components/WorkoutTemplate';
import { ExerciseModel, WorkoutModel } from '../types/Workout.types';

const exercises: ExerciseModel[] = [
{ id: 123, name: 'Squat', tags: [ 'Legs' ], sets: [ { volume: 100, reps: 12 }, { volume: 90, reps: 12 }, { volume: 90, reps: 8 } ] },
{ id: 323, name: 'Squat', tags: [ 'Legs' ], sets: [ { volume: 100, reps: 12 }, { volume: 90, reps: 12 }, { volume: 90, reps: 8 } ] },
{ id: 588, name: 'Squat', tags: [ 'Legs' ], sets: [ { volume: 100, reps: 12 }, { volume: 90, reps: 12 }, { volume: 90, reps: 8 } ] },
];

const workouts: WorkoutModel[] = [
  { exercises: exercises },
  { exercises: exercises }
]

export default function PersonalWorkoutsPage() {
  
  const [workoutsList, setWorkoutsList] = useState(workouts);

  function handleWorkoutRemoval(index: number) {
    // api
    setWorkoutsList(workoutsList.filter((workout, i) => index !== i));
  }

  return (
    <>
      <WorkoutTemplate />
      {workoutsList.map((workout, index) => (
        <Workout key={index} exercises={workout.exercises} removeWorkout={() => handleWorkoutRemoval(index)}/>
      ))}
    </>
  );
}
