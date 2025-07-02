'use client';

import { useState } from 'react';
import Exercise from "./Exercise";
import styles from "./Workout.module.css";
import BorderColorIcon from '@mui/icons-material/BorderColor';
import DoneIcon from '@mui/icons-material/Done';
import ClearIcon from '@mui/icons-material/Clear';
import { WorkoutProps } from '../types/Workout.types';
import CustomPlusIcon from './CustomPlusIcon';

function Workout({ exercises, removeWorkout }: WorkoutProps) {
  const [hovered, setHovered] = useState(false);

  const [checkHovered, setCheckHovered] = useState(false);
  const [cancelHovered, setCancelHovered] = useState(false);

  const [exercisesList, setExercisesList] = useState(exercises);

  const [formEdit, setFormEdit] = useState(false);

  function initEdit() {
    setFormEdit(true);
    
    // makee state that initializes on atleast the my-workouts layout lvl 
    // to get a big title to say "click on any value to change it" 
    // + to make sure if somewhere outside the card is pressed the editing stops

  }
  function submitChanges(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    console.log('yeah');
    // api
    setFormEdit(false);
  }
  function handleExerciseDeletion(id: number, index: number) {
    // api 
    setExercisesList(exercisesList.filter((exercise, i) => index !== i)); // remove this and index parameter after api implementation (possibly)
    
    if(exercisesList.length === 1) removeWorkout();
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

              onMouseEnter={() => setCancelHovered(true)}
              onMouseLeave={() => setCancelHovered(false)}
              onClick={() => setFormEdit(false)}
            >
              <ClearIcon fontSize='large'/>
            </button>
          </div>
          {exercisesList.map((exercise, index) => (
            <Exercise key={index} sets={exercise.sets} name={exercise.name} editting={formEdit} deleteExercise={() => handleExerciseDeletion(exercise.id, index)}/>
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
          onClick={initEdit}
        >
          <BorderColorIcon fontSize="large" />
        </div>
        {exercisesList.map((exercise, index) => (
          <Exercise key={index} sets={exercise.sets} name={exercise.name} />
        ))}
      </div>
  );
}

export default Workout;
