'use client'

import { useEffect, useRef, useState } from 'react';
import { WorkoutModel } from '@/app/types/Workout.types';
import { fetchPersonalWorkoutList } from '@/app/requests/fetchs';
import WorkoutsList from '@/app/components/Workouts/List/WorkoutsList';
import dayjs from 'dayjs';
import { jwtDecode } from 'jwt-decode';
import SearchBar from '../List/WorkoutsSearchBar';

type JwtPayload = {
  sub: string
}

export default function WorkoutManager({ userId } : { userId?: string }) {
  const decoded: JwtPayload = jwtDecode(localStorage.getItem('accessToken') || '');
  const [workoutsList, setWorkoutsList] = useState<WorkoutModel[]>([]);
  let date = Date();
  const [selectedDate, setSelectedDate] = useState(dayjs(date));
  const [calendar, setCalendar] = useState(false);
  const [loading, setLoading] = useState(false);

  const [offset, setOffset] = useState(0);
  const limit = 3;
  const [last, setLast] = useState(false);

  const hasLoadedRef = useRef(false);

  async function loadWorkouts() {
    if(last || loading) return;
    setLoading(true);
    try {
      let data;
      if(calendar) data = await fetchPersonalWorkoutList({ limit, offset, date: selectedDate, id: userId });
      else data = await fetchPersonalWorkoutList({ limit, offset, id: userId });
      setWorkoutsList(prev => [...prev, ...data.workouts]);
      setOffset(prev => prev + limit);
      setLast(data.last);
    } catch (err) {
      alert('Failed to fetch template exercises');
      console.error('Failed to fetch template exercises', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setOffset(0);
    setLast(false);
    setWorkoutsList([]);
  }, [calendar, selectedDate]);
  useEffect(() => {
    if(offset === 0 && hasLoadedRef.current) loadWorkouts();
    hasLoadedRef.current = true;
  }, [offset]);

  async function handleWorkoutRemoval(id: string) {
    setWorkoutsList(prev => prev?.filter(workout => workout.id !== id));
  }

  return (
    <>
      <SearchBar />
      <WorkoutsList 
        workouts={workoutsList}
        personal={!userId || decoded.sub === userId}
        removeWorkout={handleWorkoutRemoval}
        fetchMoreWorkouts={loadWorkouts}
        dateFilter={selectedDate}
        setDateFilter={setSelectedDate}
        calendar={calendar}
        setCalendar={setCalendar}
        loading={loading}
      />
    </>
  );
}
