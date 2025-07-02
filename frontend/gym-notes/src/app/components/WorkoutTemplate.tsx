'use client';

import { useState } from "react";
import Exercise from "./Exercise";
import styles from "./WorkoutTemplate.module.css";
import AddBoxIcon from '@mui/icons-material/AddBox';
import UndoIcon from '@mui/icons-material/Undo';

const exercises = [
{ name: 'Exercise Name', tags: [ '...' ], sets: [ { }, {  }, {  } ] },
{ name: 'Exercise Name', tags: [ '...' ], sets: [ { }, {  }, {  } ] },
{ name: 'Exercise Name', tags: [ '...' ], sets: [ { }, {  }, {  } ] },
];

function WorkoutTemplate() {
  const [ activate, setActivate ] = useState(false);
  const [ activateHover, setActivateHover ] = useState(false);
  const [ undoHover, setUndoHover ] = useState(false);


  function submitChanges(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // api
  }

    return activate ? (
      <form onSubmit={submitChanges}>
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
            <Exercise key={index} sets={exercise.sets} name={exercise.name} editting={true}/>
            ))}
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
