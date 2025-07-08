'use client'

import { useEffect, useState } from 'react';
import { WorkoutModel } from '@/app/types/Workout.types';
import { fetchDeleteWorkout, fetchPersonalWorkoutList, tempFetchDeleteWorkout, tempFetchPersonalWorkoutList } from '@/app/requests/fetchs';
import WorkoutsList from '@/app/components/Workouts/List/WorkoutsList';

export default function PersonalWorkoutsPage() {
  const [workoutsList, setWorkoutsList] = useState<WorkoutModel[]>([]);

  useEffect(() => {
    async function loadWorkouts() {
      try {
        const data = await tempFetchPersonalWorkoutList();
        setWorkoutsList(data);
      } catch (err) {
        alert('Failed to fetch template exercises');
        console.error('Failed to fetch template exercises', err);
      }
    }

    loadWorkouts();
  }, []);

  async function handleWorkoutRemoval(id: number) {
    // api
    console.log('yes');

    try {
      await tempFetchDeleteWorkout(id);
      setWorkoutsList(prev => prev?.filter(workout => workout.id !== id));
    } catch (err) {
      alert(err);
      console.error(err);
    }
  }

  return (
    <WorkoutsList workouts={workoutsList} personal={true} removeWorkout={handleWorkoutRemoval}/>
  );
}
