import Autocomplete from '@mui/material/Autocomplete';
import styles from './ExerciseSearchBox.module.css';
import TextField from '@mui/material/TextField';
import DoneIcon from '@mui/icons-material/Done';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ExerciseSet } from '../types/Workout.types';

const exercisesList = [ 
  { name: 'Squat', tags: ['Legs'], reps: true, volume: true, distance: false, duration: false },
  { name: 'Benchpress', tags: ['Chest', 'Arms'], reps: true, volume: true, distance: false, duration: false },
  { name: 'Deadlift', tags: ['Legs', 'Chest', 'Back', 'Arms'], reps: true, volume: true, distance: false, duration: false },
  { name: 'Pull Ups', tags: ['Back', 'Arms'], reps: true, volume: true, distance: false, duration: false },
  { name: 'Dips', tags: ['Chest', 'Arms'], reps: true, volume: true, distance: false, duration: false },
  { name: 'Chest Flys', tags: ['Chest'], reps: true, volume: true, distance: false, duration: false },
  { name: 'Incline Benchpress', tags: ['Chest', 'Arms'], reps: true, volume: true, distance: false, duration: false },
  { name: 'Lat Pulldowns', tags: ['Back', 'Arms'], reps: true, volume: true, distance: false, duration: false },
  { name: 'Rear Delt Flys', tags: ['Back', 'Arms'], reps: true, volume: true, distance: false, duration: false },
  { name: 'Plank', tags: ['Back', 'Abs'], reps: false, volume: true, distance: false, duration: true },
  { name: 'Treadmill', tags: ['Cardio'], reps: false, volume: true, distance: true, duration: true },
  { name: 'Static Bike', tags: ['Cardio'], reps: false, volume: false, distance: true, duration: true },

]; // api call for those

type NameBoxProps = {
  submitExerciseChange: (name: string, tags: string[], set: ExerciseSet) => void
  name?: string;
}

export default function ExerciseSearchBox({ submitExerciseChange, name } : NameBoxProps) {
  const [textValue, setTextValue] = useState(name !== 'Exercise Name' && name !== '....' ? name : '');
  const router = useRouter();

  function handleSubmitName() {
    const exercise = exercisesList.find(exercise => exercise.name === textValue);

    if(exercise) {
      submitExerciseChange(exercise.name, exercise.tags, { 
        reps: exercise.reps ? 0 : null,
        volume: exercise.volume ? 0 : null,
        distance: exercise.distance ? 0 : null,
        duration: exercise.duration ? 0 : null
    });
    }
    else {
      router.push(`/my-workouts/exercises/new?name=${encodeURIComponent(textValue || '')}`);
    }
  }

  return (
    <div className={styles["exercises-container"]}>
        <div className={styles["search-confirm-container"]}>
            <Autocomplete
                sx={{ flexGrow: '1' }}
                freeSolo
                id="free-solo-2-demo"
                disableClearable
                options={exercisesList.map((exercise) => exercise.name)}
                value={textValue}
                onChange={(event, newValue) => setTextValue(newValue)}
                renderInput={(params) => (
                <TextField
                    {...params}
                    name="name"
                    label="Search input"
                    value={textValue}
                    onChange={(e) => setTextValue(e.target.value)}
                    slotProps={{
                      input: {
                          ...params.InputProps,
                          type: 'search',
                      },
                    }}
                />
                )}
            />
            <button type="button" className={styles["confirm-button"]} onClick={handleSubmitName}>
                <DoneIcon fontSize='large'/>
            </button>
        </div>
        <div className={styles["names-container"]}>
          {exercisesList.map((exercise, index) => (
            <button
              type="button"
              key={'select exercise' + index}
              className={styles["exercise-button"]}
              onClick={() => setTextValue(exercise.name)}
            >
              {exercise.name}
            </button>
          ))}
        </div>
    </div>
  );
}
