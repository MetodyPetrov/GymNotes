'use client'

import { useEffect, useState } from 'react';
import Workout from '../components/Workout';
import WorkoutTemplate from '../components/WorkoutTemplate';
import { WorkoutModel } from '../types/Workout.types';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import dayjs, { Dayjs } from 'dayjs';
import { fetchDeleteWorkout, fetchPersonalWorkoutList, tempFetchPersonalWorkoutList } from '../requests/fetchs';

export default function PersonalWorkoutsPage() {
  const [calendarHover, setCalenderHover] = useState(false);
  const [calendar, setCalendar] = useState(false);
  const [workoutsList, setWorkoutsList] = useState<WorkoutModel[]>();
  const [initWorkouts, setInitWorkouts] = useState<WorkoutModel[]>();

  useEffect(() => {
      async function loadWorkouts() {
        try {
          const data = await tempFetchPersonalWorkoutList();
          setWorkoutsList(data);
          setInitWorkouts(data);
        } catch (err) {
          alert('Failed to fetch template exercises');
          console.error('Failed to fetch template exercises', err);
        }
      }
  
      loadWorkouts();
    }, []);

  let date = Date();
  const [selectedDate, setSelectedDate] = useState(dayjs(date));

  async function handleWorkoutRemoval(id: number) {
    // api
    console.log('yes');
    // if(typeof id === 'string') {
    //   setWorkoutsList(workoutsList.filter((workout) => workout.id !== id));
    //   return;
    // }

    try {
      await fetchDeleteWorkout(id);
      setWorkoutsList(workoutsList?.filter((workout) => workout.id !== id));
    } catch (err) {
      alert(err);
      console.error(err);
    }
  }

  function handleCalendar() {
    if(calendar) setWorkoutsList(initWorkouts);
    else handleDateFilter(selectedDate);
    setCalendar(!calendar);
  }

  function handleDateFilter(date: Dayjs|null) {
    if(!date || date.isSame(dayjs(), 'day')) return;
    setSelectedDate(date);
    setWorkoutsList(initWorkouts?.filter((initWorkouts) => initWorkouts.dateCreated.isSame(date, 'day')));
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
        {workoutsList?.map((workout) => (
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
