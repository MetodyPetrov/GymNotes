'use client'

import { ExerciseProps } from "../types/Workout.types";
import RemoveIcon from '@mui/icons-material/Remove';
import styles from "./Exercise.module.css";
import { useState } from "react";
import ExerciseSearchBox from "./ExerciseSearchBox";

function Exercise({ id, name, sets, editting, deleteExercise }: ExerciseProps) {
  const [exerciseNameHover, setExerciseNameHover] = useState(false);
  const [exerciseNameClicked, setExerciseNameClicked] = useState(false);

  const [exerciseSelector, setExerciseSelector] = useState(false);
  
  function handleNameChange(event: React.MouseEvent<HTMLHeadingElement>) {

    setExerciseSelector(!exerciseSelector);
    setExerciseNameClicked(!exerciseNameClicked)
  }

  return editting ? (
    <div className={styles["exercise-container"]}>
      <h2 style={{
          color: exerciseNameHover || exerciseNameClicked ? 'white' : '#0000008f',
          border: 'dashed white 2px',
          borderRadius: '20px',
          width: 'fit-content',
          padding: '5px',
          margin: '5px 5px 10px 0px',
          cursor: 'pointer',
          backgroundColor: exerciseNameHover || exerciseNameClicked ? '#0000008f' : 'initial',
          transition: '1s'
        }}
        onMouseEnter={() => setExerciseNameHover(true)}
        onMouseLeave={() => setExerciseNameHover(false)}
        onClick={handleNameChange}
      >{name}</h2>
      {exerciseSelector && <ExerciseSearchBox/>}
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
        {sets.map((set, index) => {
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
                  <input type="number" defaultValue={set.duration} name={'durations'+index}></input><span> sec/s {last !== 2 && '-'} </span>
                </>
              }
              {
                set.distance !== null &&
                <>
                  <input type="number" defaultValue={set.distance} name={'distance'+index}></input><span> km/s</span>
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
          border: 'dashed white 2px',
          borderRadius: '20px',
          padding: '5px',
          margin: '5px 5px 10px 0px'
      }}>{name}</h2>
      <ul>
        {sets.map((set, index) => {

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
                set.distance !== null && <span>{first !== 3 && '-'} {set.distance} km/s</span>
              }          
            </li>
          )

        })}
      </ul>
    </div>
  );
}

export default Exercise;
