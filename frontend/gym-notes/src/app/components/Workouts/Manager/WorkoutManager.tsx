'use client'

import { useEffect, useRef, useState } from 'react';
import { WorkoutModel } from '@/app/types/Workout.types';
import { fetchPersonalWorkoutList, tempFetchPersonalWorkoutList } from '@/app/requests/fetchs';
import WorkoutsList from '@/app/components/Workouts/List/WorkoutsList';
import dayjs from 'dayjs';
import { jwtDecode } from 'jwt-decode';

type JwtPayload = {
  sub: string
}

export default function WorkoutManager({ userId } : { userId?: string }) {
  const decoded: JwtPayload = jwtDecode(localStorage.getItem('accessToken') || '');
  const [workoutsList, setWorkoutsList] = useState<WorkoutModel[]>([]);
  let date = Date();
  const [selectedDate, setSelectedDate] = useState(dayjs(date));
  const [calendar, setCalendar] = useState(false);

  const [offset, setOffset] = useState(0);
  const limit = 3;

  const hasLoadedRef = useRef(false);

  async function loadWorkouts() {
    try {
      let data;
      if(calendar) data = await tempFetchPersonalWorkoutList({ limit, offset, date: selectedDate, id: userId });
      else data = await tempFetchPersonalWorkoutList({ limit, offset, id: userId });
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

  useEffect(() => {
    if(calendar) {
      setOffset(0);
      setWorkoutsList([]);
    }
  }, [calendar, selectedDate]);
  useEffect(() => {
    if(calendar && offset === 0) loadWorkouts();
  }, [offset]);

  async function handleWorkoutRemoval(id: number) {
    setWorkoutsList(prev => prev?.filter(workout => workout.id !== id));
  }

  return (
    <WorkoutsList 
      workouts={workoutsList}
      personal={!userId || decoded.sub === userId} // TODO: MAKE THIS TSX REUSABLE AND USE IT IN \explore\users\[id]\page.tsx
      removeWorkout={handleWorkoutRemoval}
      fetchMoreWorkouts={loadWorkouts}
      dateFilter={selectedDate}
      setDateFilter={setSelectedDate}
      calendar={calendar}
      setCalendar={setCalendar}
    />
  );
}
