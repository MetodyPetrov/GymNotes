'use client';

import { useState } from "react";
import Exercise from "./Exercise";
import styles from "./WorkoutTemplate.module.css";
import AddBoxIcon from '@mui/icons-material/AddBox';
import UndoIcon from '@mui/icons-material/Undo';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CustomPlusIcon from "./CustomPlusIcon";

const exercisesTemplate = [
  { name: 'Exercise Name', tags: [ '...' ], sets: [ { }, {  }, {  } ] },
  { name: 'Exercise Name', tags: [ '...' ], sets: [ { }, {  }, {  } ] },
  { name: 'Exercise Name', tags: [ '...' ], sets: [ { }, {  }, {  } ] },
];

function WorkoutTemplate() {
  const [ activate, setActivate ] = useState(false);
  const [ activateHover, setActivateHover ] = useState(false);

  const [ undoHover, setUndoHover ] = useState(false);
  const [ confirmHover, setConfirmHover ] = useState(false);


  const [ exercises, setExercises ] = useState(exercisesTemplate);

  function handleNewExercise() {
    setExercises([...exercises, { name: 'Exercise Name', tags: [ '...' ], sets: [ { }, {  }, {  } ] } ]);
  }
  function removeExercise(i: number) {
    setExercises(exercises.filter((exercise, index) => index !== i));
    if(exercises.length === 1) {
      setActivate(false);
      setExercises(exercisesTemplate);
    }
  }

  function handleConfirmWorkout() {
    // api
    console.log('mhm');
  }

    return activate ? (
      <form>
        <div className={styles['template-card-outline']} style={{ position: 'relative' }}>
            <UndoIcon style={{ 
              width: '50px',
              height: '50px',
              position: 'absolute',
              top: '16px',
              right: '16px',
              color: undoHover ? '#0c0088' : 'inherit',
              cursor: 'pointer',
              transition: '0.3s'
            }}
              onMouseEnter={() => setUndoHover(true)}
              onMouseLeave={() => setUndoHover(false)}
              onClick={() => {setActivate(false); setUndoHover(false)}}
            />
            {exercises.map((exercise, index) => (
              <Exercise key={index} sets={exercise.sets} name={exercise.name} editting={true} deleteExercise={() => removeExercise(index)}/>
            ))}
            <CustomPlusIcon onClick={handleNewExercise}/>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center', position: 'relative', right: '10px' }} >
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
                onClick={() => { setActivate(false); setConfirmHover(false); handleConfirmWorkout(); }}
              />
            </div>
        </div>
    </form>) : ( 
      <button
        style={{
          cursor: 'pointer',
          transition: '0.3s',
          backgroundColor: activateHover ?'rgb(255, 187, 0)' : 'white',
          borderRadius: '5px' 
        }}
        onClick={() => { setActivate(true);setActivateHover(false); }}
        onMouseEnter={() => setActivateHover(true)}
        onMouseLeave={() => setActivateHover(false)}
      >
        <AddBoxIcon fontSize="large" style={{ width: '100px', height: '100px' }}/>
      </button>
    );
}

export default WorkoutTemplate;
