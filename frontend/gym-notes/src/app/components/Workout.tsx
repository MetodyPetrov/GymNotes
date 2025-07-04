'use client';

import { useEffect, useState } from 'react';
import Exercise from "./Exercise";
import styles from "./Workout.module.css";
import BorderColorIcon from '@mui/icons-material/BorderColor';
import DoneIcon from '@mui/icons-material/Done';
import ClearIcon from '@mui/icons-material/Clear';
import { ExerciseModel, WorkoutProps } from '../types/Workout.types';
import CustomPlusIcon from './CustomPlusIcon';

import { exercisesDeepCopy } from '../deep-copy-builders/functions';

function Workout({ id, exercises, date, removeWorkout }: WorkoutProps) {
  const [hovered, setHovered] = useState(false);

  const [checkHovered, setCheckHovered] = useState(false);
  const [cancelHovered, setCancelHovered] = useState(false);

  const [exercisesList, setExercisesList] = useState(exercisesDeepCopy(exercises));

  const [formEdit, setFormEdit] = useState(false);

  const [currentExercises, setCurrentExercises] = useState<ExerciseModel[]>([]);

  useEffect(() => {
    const copiedExercises = exercisesDeepCopy(exercisesList);
    setCurrentExercises(copiedExercises);
  }, []);


  function submitChanges(event?: React.FormEvent<HTMLFormElement>) {
    event?.preventDefault();

    const form = event?.currentTarget;
    const formData = new FormData(form);

    console.log('yeah');
    // api

    //frontend data handling
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

    const tempExerciseList = exercisesDeepCopy(exercisesList);
    for(let exerciseIt = 0, arrIt = 0; exerciseIt < tempExerciseList.length; exerciseIt++) {
      for(let setIt = 0; setIt < tempExerciseList[exerciseIt].sets.length; setIt++, arrIt++) {
        tempExerciseList[exerciseIt].sets[setIt].reps = repArr[arrIt] as unknown as number;
        tempExerciseList[exerciseIt].sets[setIt].volume = kgArr[arrIt] as unknown as number;
        tempExerciseList[exerciseIt].sets[setIt].duration = secArr[arrIt] as unknown as number;
      }  
    }
    setFormEdit(false);
    setExercisesList(tempExerciseList);
    setCurrentExercises(exercisesDeepCopy(tempExerciseList));
  }
  function handleExerciseDeletion(exerciseId: number) {
    setExercisesList(exercisesList.filter((exercise) => exercise.id !== exerciseId));
    if(exercisesList.length === 1) {
      removeWorkout(id);
      // modal asking if the person's sure they want to remove the workout
    }
  }

  function handleNewExercise() {
    setExercisesList([...exercisesList, 
      {
        id: -1,
        name: '....',
        tags: [  ],
        sets: [ 
          { reps: 0, volume: 0, distance: 0, duration: 0 },
          { reps: 0, volume: 0, distance: 0, duration: 0 },
          { reps: 0, volume: 0, distance: 0, duration: 0 }
        ]
      }
    ]);
  }
  function handleDiscardChanges() {
    setFormEdit(false);
    setExercisesList(exercisesDeepCopy(currentExercises));
  }
  
    return formEdit ? (
      <form onSubmit={submitChanges}>
        <div className={styles['selected-card-outline']} style={{ position: 'relative' }}>
          <div
            style={{
              position: 'absolute',
              top: '30px',
              right: '30px',
              display: 'flex',
              gap: '5px'
            }}
          >
            <button 
              style={{ 
                backgroundColor:  checkHovered ? 'green' : 'white',
                color: checkHovered ? 'white' : 'green',
                transition: '0.3s',
                borderRadius: '5px', 
                border: 'none',
                height: '35px',
                cursor: 'pointer',
                zIndex: '1'
              }}

              onMouseEnter={() => setCheckHovered(true)}
              onMouseLeave={() => setCheckHovered(false)}
            >
              <DoneIcon fontSize='large'/>
            </button>
            <button 
              style={{ 
                backgroundColor:  cancelHovered ? 'black' : 'red',
                color: cancelHovered ? 'red' : 'black',
                transition: '0.3s',
                borderRadius: '5px', 
                border: 'none',
                height: '35px',
                cursor: 'pointer',
                zIndex: '1'
              }}
              
              type='button'
              onMouseEnter={() => setCancelHovered(true)}
              onMouseLeave={() => setCancelHovered(false)}
              onClick={handleDiscardChanges}
            >
              <ClearIcon fontSize='large'/>
            </button>
          </div>
          {exercisesList.map((exercise) => (
            <Exercise id={exercise.id} key={'exercise' + exercise.id} sets={exercise.sets} name={exercise.name} editting={formEdit} deleteExercise={() => handleExerciseDeletion(exercise.id)}/>
          ))}
          <CustomPlusIcon onClick={handleNewExercise}/>
        </div>
      </form>
    ) : (
      <div className={styles['card-outline']} style={{ position: 'relative' }}>
        <div
          style={{
            position: 'absolute',
            top: '20px',
            right: '30px',
            color: hovered ? '#1976d2' : 'inherit',
            cursor: 'pointer',
            transition: '0.3s',
            zIndex: '1'
          }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onClick={() => setFormEdit(true)}
        >
          <BorderColorIcon fontSize="large" sx={{ width: '50px', height: '50px' }}/>
        </div>
        {exercisesList.map((exercise) => (
          <Exercise id={exercise.id} key={'exerciseshow' + exercise.id} sets={exercise.sets} name={exercise.name} />
        ))}
        <h5 style={{ fontWeight: '500', fontSize: '1rem', position:'absolute', top: '5px', left: '60px', color: '#003a7e' }}>Date: {date.format().split('T')[0]}</h5>
      </div>
  );
}

export default Workout;
