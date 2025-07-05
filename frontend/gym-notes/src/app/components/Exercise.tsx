'use client'

import { ExerciseProps, ExerciseSet } from "../types/Workout.types";
import RemoveIcon from '@mui/icons-material/Remove';
import styles from "./Exercise.module.css";
import { useState } from "react";
import ExerciseSearchBox from "./ExerciseSearchBox";

function Exercise({ id, name, sets, editting, deleteExercise, changeWorkoutTags }: ExerciseProps) {
  const [exerciseNameHover, setExerciseNameHover] = useState(false);
  const [exerciseNameClicked, setExerciseNameClicked] = useState(false);

  const [exerciseName, setExerciseName] = useState(name);
  const [exerciseSets, setExerciseSets] = useState(sets);

  const [exerciseSelector, setExerciseSelector] = useState(false);
  
  function changeNameMode() {
    setExerciseSelector(!exerciseSelector);
    setExerciseNameClicked(!exerciseNameClicked)
  }

  function handleExerciseSelect(name: string, tags: string[], set: ExerciseSet) {
    setExerciseName(name);
    setExerciseSets([ set, set, set ]);
    changeWorkoutTags && changeWorkoutTags(tags, id, false);
    changeNameMode();
  }

  return editting ? (
    <div className={styles["exercise-container"]}>
      <h2 style={{
          fontSize: '1.5em',
          color: (editting === 'template') && (exerciseNameHover || exerciseNameClicked) ? 'white' : '#0000008f',
          border: editting === 'template' ? 'dashed white 2px' : '0px',
          borderRadius: '20px',
          width: 'fit-content',
          padding: '5px',
          margin: '5px 5px 10px 0px',
          cursor: editting === 'template' ? 'pointer' : 'not-allowed',
          backgroundColor: (editting === 'template') && (exerciseNameHover || exerciseNameClicked) ? '#0000008f' : 'initial',
          transition: '1s'
        }}
        onMouseEnter={() => setExerciseNameHover(true)}
        onMouseLeave={() => setExerciseNameHover(false)}
        onClick={changeNameMode}
      >{exerciseName}</h2>
      {
        <div style={{ display: editting === 'template' && exerciseSelector ? '' : 'none' }}>
          <ExerciseSearchBox submitExerciseChange={handleExerciseSelect} name={name}/>
        </div>
      }
      <button type="button" style={{ height: '54px', cursor: 'pointer' }} 
        onClick={deleteExercise}
      >
        <RemoveIcon style={{
          width: '50px',
          height: '50px',
          backgroundColor: 'red',
          borderRadius: '5px',
          color: 'white', 
          cursor: 'pointer',
          transition: '0.3s'
        }}/>
      </button>
      <ul>
        {exerciseSets.map((set, index) => {
          let last;

          if(set.duration !== null) last = 2;
          else if(set.volume !== null) last = 1;
          else if(set.reps !== null) last = 0;

          return (
            <li key={'set exercise edit' + id + index} className={styles["exerciseList"]}>
              {
                set.reps !== null && 
                <>
                  <input type="number" defaultValue={set.reps} name={'reps'+index}></input><span> reps {last !== 0 && '-'} </span>
                </>
              }
              {
                set.volume !== null && 
                <>
                  <input type="number" defaultValue={set.volume} name={'kg'+index}></input><span> kg {last !== 1 && '-'} </span>
                </>
              }
              {
                set.duration !== null && 
                <>
                  <input type="number" defaultValue={set.duration} name={'duration'+index}></input><span> sec/s {last !== 2 && '-'} </span>
                </>
              }
              {
                set.distance !== null &&
                <>
                  <input type="number" defaultValue={set.distance} name={'meter'+index}></input><span> m</span>
                </>
              }
            </li>
          );
        })}
      </ul>
    </div>
  ) : (
    <div className={styles["exercise-container"]}>
      <h2 style={{
          color: 'black',
          borderRadius: '20px',
          padding: '5px',
          margin: '5px 5px 10px 0px'
      }}>{name}</h2>
      <ul>
        {exerciseSets.map((set, index) => {

          let first;
          if(set.reps!==null) first = 0;
          else if(set.volume!==null) first = 1;
          else if(set.duration!==null) first = 2;
          else if(set.distance!==null) first = 3;

          return (
            <li key={'set exercise display' + id + index}>
              {
                set.reps !== null && <span>{set.reps} reps </span>
              }
              {
                set.volume !== null && <span>{first !== 1 && '-'} {set.volume} kg </span>
              }
              {
                set.duration !== null && <span>{first !== 2 && '-'} {set.duration} sec/s </span>
              }
              {
                set.distance !== null && <span>{first !== 3 && '-'} {set.distance} m</span>
              }          
            </li>
          )

        })}
      </ul>
    </div>
  );
}

export default Exercise;
