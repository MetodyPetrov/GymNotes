'use client';

import { useState } from "react";
import Exercise from "./Exercise";
import styles from "./WorkoutTemplate.module.css";
import AddBoxIcon from '@mui/icons-material/AddBox';
import UndoIcon from '@mui/icons-material/Undo';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CustomPlusIcon from "./CustomPlusIcon";
import Button from "@mui/material/Button";
import { exercisesDeepCopy } from "../deep-copy-builders/functions";
import { ExerciseModel } from "../types/Workout.types";

const exercisesTemplate: ExerciseModel[] = [
  { id: -1, name: 'Exercise Name', tags: [ '...' ], sets: [ { volume: 0, duration: 0, reps: 0, distance: 0 }, { volume: 0, duration: 0, reps: 0, distance: 0 }, { volume: 0,duration: 0, reps: 0, distance: 0 } ] },
  { id: -1, name: 'Exercise Name', tags: [ '...' ], sets: [ { volume: 0, duration: 0, reps: 0, distance: 0 }, { volume: 0, duration: 0, reps: 0, distance: 0 }, { volume: 0,duration: 0, reps: 0, distance: 0 } ] },
  { id: -1, name: 'Exercise Name', tags: [ '...' ], sets: [ { volume: 0, duration: 0, reps: 0, distance: 0 }, { volume: 0, duration: 0, reps: 0, distance: 0 }, { volume: 0,duration: 0, reps: 0, distance: 0 } ] }
];

function WorkoutTemplate() {
  const [ activate, setActivate ] = useState(false);
  const [ activateHover, setActivateHover ] = useState(false);

  const [ undoHover, setUndoHover ] = useState(false);
  const [ confirmHover, setConfirmHover ] = useState(false);


  const [ exercises, setExercises ] = useState(exercisesTemplate);

  function handleNewExercise() {
    setExercises([...exercises, { id: -1, name: 'Exercise Name', tags: [ '...' ], sets: [ { volume: 0, duration: 0, reps: 0, distance: 0 }, { volume: 0, duration: 0, reps: 0, distance: 0 }, { volume: 0,duration: 0, reps: 0, distance: 0 } ] }, ]);
  }
  function removeExercise(i: number) {
    setExercises(exercises.filter((exercise, index) => index !== i));
    if(exercises.length === 1) {
      setActivate(false);
      setExercises(exercisesTemplate);
    }
  }

  function submitWorkout(event?: React.FormEvent<HTMLFormElement>) {
    event?.preventDefault();

    const form = event?.currentTarget;
    const formData = new FormData(form);

    let repArr: FormDataEntryValue[] = [];
    let kgArr: FormDataEntryValue[] = [];
    let secArr: FormDataEntryValue[] = [];

    for (const [key, value] of formData.entries()) {
      if (key.startsWith('rep')) {
        repArr.push(value);
      } else if (key.startsWith('kg')) {
        kgArr.push(value);
      } else {
        secArr.push(value);
      }
    }

    const workoutExercises = exercisesDeepCopy(exercises);
    for(let exerciseIt = 0, arrIt = 0; exerciseIt < workoutExercises.length; exerciseIt++) {
      for(let setIt = 0; setIt < workoutExercises[exerciseIt].sets.length; setIt++, arrIt++) {
        workoutExercises[exerciseIt].sets[setIt].reps = repArr[arrIt] as unknown as number;
        workoutExercises[exerciseIt].sets[setIt].volume = kgArr[arrIt] as unknown as number;
        workoutExercises[exerciseIt].sets[setIt].duration = secArr[arrIt] as unknown as number;
      }  
    }
    
    // api send workoutExercises
    console.log('mhm');
    setActivate(false); 
    setConfirmHover(false);
  }

    return activate ? (
      <form onSubmit={submitWorkout}>
        <div className={styles['template-card-outline']} style={{ position: 'relative' }}>
            <UndoIcon style={{ 
              width: '50px',
              height: '50px',
              position: 'absolute',
              top: '16px',
              right: '16px',
              color: undoHover ? '#0c0088' : 'inherit',
              cursor: 'pointer',
              transition: '0.3s',
              zIndex: '1'
            }}
              onMouseEnter={() => setUndoHover(true)}
              onMouseLeave={() => setUndoHover(false)}
              onClick={() => {setActivate(false); setUndoHover(false);}}
            />
            {exercises.map((exercise, index) => (
              <Exercise key={index} id={-1} sets={exercise.sets} name={exercise.name} editting={'template'} deleteExercise={() => removeExercise(index)}/>
            ))}
            <CustomPlusIcon onClick={handleNewExercise}/>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center', position: 'relative', right: '10px' }} >
              <Button type="submit" sx={{ borderRadius: '50px', padding: '0px' }}>
                <CheckCircleIcon style={{ 
                  width: '100px',
                  height: '100px',
                  color: confirmHover ? 'white' : '#00be00',
                  backgroundColor: confirmHover ? '#00be00' : 'white',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  borderRadius: '50px'
                }}
                  onMouseEnter={() => setConfirmHover(true)}
                  onMouseLeave={() => setConfirmHover(false)}
                />
              </Button>
            </div>
        </div>
    </form>) : ( 
      <button
        style={{
          cursor: 'pointer',
          transition: '0.5s',
          backgroundColor: activateHover ? '#1976d2' : 'white',
          borderRadius: '50px',
          border: activateHover ? 'solid 2px white' : 'solid 2px #1976d2',
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
          color: activateHover ? 'white' : 'black',
          fontSize: '2rem',
          fontWeight: '800',
          padding: '20px'
        }}
        onClick={() => { setActivate(true);setActivateHover(false); }}
        onMouseEnter={() => setActivateHover(true)}
        onMouseLeave={() => setActivateHover(false)}
      >
        <AddBoxIcon fontSize="large" style={{ width: '100px', height: '100px', fill: activateHover ? 'white' : 'initial', transition: '0.5s' }}/>
        Add New
      </button>
    );
}

export default WorkoutTemplate;
