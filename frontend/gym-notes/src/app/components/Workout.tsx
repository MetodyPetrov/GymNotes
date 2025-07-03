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

function Workout({ exercises, date, removeWorkout }: WorkoutProps) {
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
    console.log('yeah');
    // api
    setFormEdit(false);
    setCurrentExercises(exercisesDeepCopy(exercisesList));
  }
  function handleExerciseDeletion(id: number, index: number) {
    setExercisesList(exercisesList.filter((exercise, i) => exercise.id !== id));
    if(exercisesList.length === 1) {
      removeWorkout();
      // modal asking if the person's sure they want to remove the workout
    }
  }

  function handleNewExercise() {
    setExercisesList([...exercisesList, 
      {
        id: -1,
        name: '....',
        tags: [  ],
        sets: [ {  }, {  }, {  } ] 
      }
    ]);
  }
  function handleDiscardChanges() {
    setFormEdit(false);
    setExercisesList(exercisesDeepCopy(currentExercises));
  }

    return formEdit ? (
      <form onSubmit={submitChanges}>
        <div className={styles['card-outline']} style={{ position: 'relative' }}>
          <div
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
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
                cursor: 'pointer'
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
                cursor: 'pointer'
              }}
              
              type='button'
              onMouseEnter={() => setCancelHovered(true)}
              onMouseLeave={() => setCancelHovered(false)}
              onClick={handleDiscardChanges}
            >
              <ClearIcon fontSize='large'/>
            </button>
          </div>
          {exercisesList.map((exercise, index) => (
            <Exercise id={exercise.id} key={'exercise' + exercise.id} sets={exercise.sets} name={exercise.name} editting={formEdit} deleteExercise={() => handleExerciseDeletion(exercise.id, index)}/>
          ))}
          <CustomPlusIcon onClick={handleNewExercise}/>
        </div>
      </form>
    ) : (
      <div className={styles['card-outline']} style={{ position: 'relative' }}>
        <div
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            color: hovered ? '#0c0088' : 'inherit',
            cursor: 'pointer',
            transition: '0.3s'
          }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onClick={() => setFormEdit(true)}
        >
          <BorderColorIcon fontSize="large" />
        </div>
        {exercisesList.map((exercise) => (
          <Exercise id={exercise.id} key={'exerciseshow' + exercise.id} sets={exercise.sets} name={exercise.name} />
        ))}
        <h5 style={{ fontWeight: '500', fontSize: '1rem' }}>Date: {date.format().split('T')[0]}</h5>
      </div>
  );
}

export default Workout;
