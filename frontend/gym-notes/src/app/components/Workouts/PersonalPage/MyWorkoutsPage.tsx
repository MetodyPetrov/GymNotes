'use client'

import { useEffect, useRef, useState } from 'react';
import { WorkoutModel } from '@/app/types/Workout.types';
import { fetchPersonalWorkoutList, tempFetchPersonalWorkoutList } from '@/app/requests/fetchs';
import WorkoutsList from '@/app/components/Workouts/List/WorkoutsList';

export default function PersonalWorkoutsPage() {
  const [workoutsList, setWorkoutsList] = useState<WorkoutModel[]>([]);
  const [offset, setOffset] = useState(0);
  const limit = 3;

  const hasLoadedRef = useRef(false);

  async function loadWorkouts() {
    try {
      const data = await tempFetchPersonalWorkoutList(limit, offset);
      setWorkoutsList(prev => [...prev, ...data]);
      setOffset(prev => prev + limit);
    } catch (err) {
      alert('Failed to fetch template exercises');
      console.error('Failed to fetch template exercises', err);
    }
  }

  useEffect(() => {
    if (!hasLoadedRef.current) {
      hasLoadedRef.current = true;
      loadWorkouts();
    }
  }, []);

  async function handleWorkoutRemoval(id: number) {
    setWorkoutsList(prev => prev?.filter(workout => workout.id !== id));
  }

  return (
    <WorkoutsList workouts={workoutsList} personal={true} removeWorkout={handleWorkoutRemoval} fetchMoreWorkouts={loadWorkouts}/>
  );
}
