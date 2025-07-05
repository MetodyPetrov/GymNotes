'use client'

import { useState } from 'react';
import Workout from '../components/Workout';
import WorkoutTemplate from '../components/WorkoutTemplate';
import { ExerciseModel, WorkoutModel } from '../types/Workout.types';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import dayjs, { Dayjs } from 'dayjs';
import { workoutsDeepCopy } from '../deep-copy-builders/functions';

const exercises: ExerciseModel[] = [
  { id: 123, name: 'Squat', tags: [ 'Legs' ], sets: [ { volume: 100, reps: 12, duration: null, distance: null }, { volume: 90, reps: 12, duration: null, distance: null }, { volume: 90, reps: 8, duration: null, distance: null } ] },
  { id: 323, name: 'Squat', tags: [ 'Legs' ], sets: [ { volume: 100, reps: 12, duration: null, distance: null }, { volume: 90, reps: 12, duration: null, distance: null }, { volume: 90, reps: 8, duration: null, distance: null } ] },
  { id: 588, name: 'Squat', tags: [ 'Legs' ], sets: [ { volume: 100, reps: 12, duration: null, distance: null }, { volume: 90, reps: 12, duration: null, distance: null }, { volume: 90, reps: 8, duration: null, distance: null } ] },
];

const workouts: WorkoutModel[] = [
  { id: 32132, exercises: exercises, dateCreated: dayjs('2025-07-01') },
  { id: 545555, exercises: exercises, dateCreated: dayjs('2025-06-27') }
]

export default function PersonalWorkoutsPage() {
  const [calendarHover, setCalenderHover] = useState(false);
  const [calendar, setCalendar] = useState(false);
  const [workoutsList, setWorkoutsList] = useState(workoutsDeepCopy(workouts));

  let date = Date();
  const [selectedDate, setSelectedDate] = useState(dayjs(date));

  function handleWorkoutRemoval(id: number | string) {
    // api
    console.log('yes');
    setWorkoutsList(workoutsList.filter((workout) => workout.id !== id));
  }

  function handleCalendar() {
    if(calendar) setWorkoutsList(workouts); // or api call to get all workouts back (better option since someone might've commented or liked)
    else handleDateFilter(selectedDate);
    setCalendar(!calendar);
  }

  function handleDateFilter(date: Dayjs|null) {
    if(!date || date.isSame(dayjs(), 'day')) return;
    setSelectedDate(date);
    
    console.log('yessir');
    // api
    // setWorkoutsList with the new workouts
    setWorkoutsList(workouts.filter((workout) => workout.dateCreated.isSame(date, 'day')));
  }

  return (
    <div style={{ 
        display: 'flex',
        justifyContent: 'center',
        gap: '32px'
      }}
    >
      <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '32px'
        }}
      >
        <WorkoutTemplate />
        {workoutsList.map((workout) => (
          <Workout id={workout.id} key={'workout' + workout.id} exercises={workout.exercises} date={workout.dateCreated} removeWorkout={handleWorkoutRemoval}/>
        ))}
      </div>
      
      <div style={{ display: 'flex', position: 'sticky', top: '0px', height: 'fit-content' }}>
        <CalendarMonthIcon sx={{
            cursor: 'pointer',
            width: '100px',
            height: '100px',
            color: (calendarHover || calendar) ? '#ffd86e' : 'white',
            transition: '0.3s'
          }}
          onMouseEnter={() => setCalenderHover(true)}
          onMouseLeave={() => setCalenderHover(false)}
          onClick={handleCalendar}
        />
        {calendar && <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateCalendar value={selectedDate} onChange={handleDateFilter} sx={{ backgroundColor: 'white', color: 'black', borderRadius: '20px', position: 'absolute', left: '100px', top: '10px' }}/>
        </LocalizationProvider>}
      </div>

    </div>
  );
}
