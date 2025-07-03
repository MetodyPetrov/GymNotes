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
  { id: 32132, exercises: exercises },
  { id: 545555, exercises: exercises }
]

export default function PersonalWorkoutsPage() {
  
  const [workoutsList, setWorkoutsList] = useState(workouts);

  function handleWorkoutRemoval(index: number) {
    // api
    console.log('yes');
    setWorkoutsList(workoutsList.filter((workout, i) => index !== i));
  }

  return (
    <div style={{
        width: '70%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '32px'
      }}
    >
      <WorkoutTemplate />
      {workoutsList.map((workout, index) => (
        <Workout key={'workout' + workout.id} exercises={workout.exercises} removeWorkout={() => handleWorkoutRemoval(index)}/>
      ))}
    </div>
  );
}
