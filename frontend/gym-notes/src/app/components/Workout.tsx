'use client'

import Exercise from "./Exercise";
import styles from "./Workout.module.css";
import BorderColorIcon from '@mui/icons-material/BorderColor';
import { useState } from 'react';

function Workout() {
  const [hovered, setHovered] = useState(false);

  return (
    <div className={styles['card-outline']}>
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
      >
        <BorderColorIcon fontSize="large" />
      </div>

      <Exercise sets={[{}, {}, {}]} name='Squat' displayReps displayVolume />
      <Exercise sets={[{}, {}, {}]} name='Running' displayDuration displayVolume />
      <Exercise sets={[{}, {}, {}]} name='Plank' displayDuration displayVolume />
      <Exercise
        sets={[
          { volume: 100, reps: 9 },
          { volume: 110, reps: 5 },
          { volume: 110, reps: 4 }
        ]}
        name='Bench'
        displayReps
        displayVolume
      />
    </div>
  );
}

export default Workout;
