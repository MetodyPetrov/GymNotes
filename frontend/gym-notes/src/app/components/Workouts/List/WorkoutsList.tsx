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
import dayjs from 'dayjs';
import CommentsList from '@/app/components/Comments/CommentsList';
import { useSearchParams } from 'next/navigation';
import Loading from '../../Loading/Loading';

export default function WorkoutsList({ workouts, personal, removeWorkout, fetchMoreWorkouts, dateFilter, setDateFilter, calendar, setCalendar, loading }: WorkoutsListProps) {
  const [calendarHover, setCalenderHover] = useState(false);
  const [commentsHover, setCommentsHover] = useState<string>();
  const [commentsOpen, setCommentsOpen] = useState<string>();

  const [workoutsList, setWorkoutsList] = useState<WorkoutModel[]>(workouts);

  const searchParams = useSearchParams();
  const copiedWorkoutId = searchParams.get('workout-id');
  const copiedWorkout = workoutsList.find(workout => workout.id.toString() === (copiedWorkoutId || -1));

  
  const lastWorkoutRef = useRef<HTMLDivElement>(null);
  const [lastWorkoutVisible, setLastWorkoutVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setLastWorkoutVisible(entry.isIntersecting), {threshold: 0.1});
    lastWorkoutRef.current && observer.observe(lastWorkoutRef.current);
    return () => {
      if (lastWorkoutRef.current) {
        observer.unobserve(lastWorkoutRef.current);
      }
    };
  }, [workoutsList]);
  useEffect(() => {
    if(lastWorkoutVisible) fetchMoreWorkouts();
  }, [lastWorkoutVisible]);


  useEffect(() => {
    setWorkoutsList(workouts);
  }, [workouts]);

  return (
    <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        gap: '32px'
      }}
    >
      { personal ? <WorkoutTemplate workout={copiedWorkout}/> : <></>}
      <div style={{ display: 'flex', gap: workouts.length ? '32px' : '0px' }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '32px'
        }}>
          {workoutsList?.map((workout) => (
            <div 
              style={{ display: 'flex', gap: '32px' }}
              key={'workout' + workout.id}
              ref={workout.id === workoutsList[workoutsList.length - 1].id ? lastWorkoutRef : null}
            >
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
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {loading ? <Loading>Loading Workouts</Loading> : <></>}
          <div style={{ display: 'flex', position: 'sticky', top: '0px', height: 'fit-content' }}>
            <CalendarMonthIcon sx={{
              cursor: loading ? 'not-allowed' : 'pointer',
              width: '100px',
              height: '100px',
              color: loading ? 'white' : ((calendarHover || calendar) ? '#ffd86e' : 'white'),
              transition: '0.3s'
            }}
              onMouseEnter={() => setCalenderHover(true)}
              onMouseLeave={() => setCalenderHover(false)}
              onClick={() => !loading && setCalendar(!calendar)}
            />
            {calendar && <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateCalendar value={dateFilter} onChange={(newDate) => setDateFilter(dayjs(newDate))} sx={{ backgroundColor: 'white', color: 'black', borderRadius: '20px', position: 'absolute', left: '100px', top: '10px' }} />
            </LocalizationProvider>}
          </div>
        </div>
      </div>
    </div>
  );
}
