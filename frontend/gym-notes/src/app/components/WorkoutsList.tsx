'use client'

import { useEffect, useRef, useState } from 'react';
import Workout from '@/app/components/Workouts/Workout/Workout';
import WorkoutTemplate from '@/app/components/Workouts/Template/WorkoutTemplate';
import { WorkoutModel, WorkoutsListProps } from '@/app/types/Workout.types';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import AddCommentIcon from '@mui/icons-material/AddComment';
import dayjs, { Dayjs } from 'dayjs';
import CommentsList from '@/app/components/Comments/CommentsList';
import { usePathname, useSearchParams } from 'next/navigation';

export default function WorkoutsList({ workouts, personal, removeWorkout }: WorkoutsListProps) {
  // const pathname = usePathname();
  // const listRef = useRef<HTMLDivElement>(null);

  const [calendarHover, setCalenderHover] = useState(false);
  const [calendar, setCalendar] = useState(false);
  const [commentsHover, setCommentsHover] = useState<number>();
  const [commentsOpen, setCommentsOpen] = useState<number>();

  const [workoutsList, setWorkoutsList] = useState<WorkoutModel[]>(workouts);
  const searchParams = useSearchParams();
  const copiedWorkout = workoutsList.find(workout => workout.id.toString() === (searchParams.get('workout-id') || -1));

  // useEffect(() => {
  //   listRef.current?.scrollTo(0,0);
  // }, [pathname]);

  useEffect(() => {
    setWorkoutsList(workouts);
  }, [workouts]);

  let date = Date();
  const [selectedDate, setSelectedDate] = useState(dayjs(date));

  function handleCalendar() {
    if (calendar) setWorkoutsList(workouts);
    else handleDateFilter(selectedDate);
    setCalendar(!calendar);
  }
  
  function handleDateFilter(date: Dayjs | null) {
    if (!date || date.isSame(dayjs(), 'day')) return;
    setSelectedDate(date);
    setWorkoutsList(workouts?.filter((workouts) => workouts.dateCreated.isSame(date, 'day')));
  }

  return (
    <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        gap: '32px'
      }}
      // ref={listRef}
    >
      { personal ? <WorkoutTemplate workout={copiedWorkout}/> : <></>}
      <div style={{ display: 'flex', gap: '32px' }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '32px'
        }}>
          {workoutsList?.map((workout) => (
            <div style={{ display: 'flex', gap: '32px' }} key={'workout' + workout.id}>
              {commentsOpen === workout.id ? <CommentsList workoutId={workout.id} close={() => {setCommentsOpen(undefined); setCommentsHover(undefined)}} /> :
                <AddCommentIcon sx={{
                    cursor: 'pointer',
                    width: '100px',
                    height: '100px',
                    color: (commentsHover === workout.id || commentsOpen === workout.id) ? '#ffd86e' : 'white',
                    transition: '0.3s'
                  }}
                    onMouseEnter={() => setCommentsHover(workout.id)}
                    onMouseLeave={() => setCommentsHover(undefined)}
                    onClick={() => setCommentsOpen(prev => prev === workout.id ? undefined : workout.id)}
                />
                }
              <Workout
                id={workout.id}
                likes={workout.likes}
                dislikes={workout.dislikes}
                hasLiked={workout.hasLiked}
                hasDisliked={workout.hasDisliked}
                exercises={workout.exercises}
                date={workout.dateCreated}
                removeWorkout={removeWorkout}
                personal={personal}
              />
            </div>
          ))}
        </div>
        <div>
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
              <DateCalendar value={selectedDate} onChange={handleDateFilter} sx={{ backgroundColor: 'white', color: 'black', borderRadius: '20px', position: 'absolute', left: '100px', top: '10px' }} />
            </LocalizationProvider>}
          </div>
        </div>
      </div>
    </div>
  );
}
