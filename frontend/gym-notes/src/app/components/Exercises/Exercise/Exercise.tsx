'use client'

import { ExerciseProps, ExerciseSet } from "@/app/types/Workout.types";
import RemoveIcon from '@mui/icons-material/Remove';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import styles from "./Exercise.module.css";
import { useState } from "react";
import ExerciseSearchBox from "../SearchBox/ExerciseSearchBox";
import AcceptCancel from "@/app/components/AcceptCancel";
import { IconButton, Tooltip } from "@mui/material";

function Exercise({
  first,
  editWorkout,
  cancelEditWorkout,
  id, newSetId, name,
  sets, tags, editting,
  deleteExercise, deleteSet, changeWorkoutTags, incrementNewSetId
}: ExerciseProps) {
  const [exerciseNameHover, setExerciseNameHover] = useState(false);
  const [exerciseNameClicked, setExerciseNameClicked] = useState(false);
  const [editWorkoutHovered, setEditWorkoutHovered] = useState(false);

  const [exerciseName, setExerciseName] = useState(name);
  const [exerciseSets, setExerciseSets] = useState(sets);
  const [exerciseId, setExerciseId] = useState(id);

  const [exerciseSelector, setExerciseSelector] = useState(false);
  
  function changeNameMode() {
    if(editting !== 'template') return;
    setExerciseSelector(prev => !prev);
    setExerciseNameClicked(prev => !prev)
  }

  function handleExerciseSelect(name: string, newTags: string[], set: ExerciseSet, id: string) {
    setExerciseName(name);
    setExerciseId(id);
    setExerciseSets([ {...set, id: 'set' + newSetId + 1 + name}, {...set, id: 'set' + newSetId + 2 + name}, {...set, id: 'set' + newSetId + 3 + name} ]);
    if(tags.length && changeWorkoutTags) changeWorkoutTags(tags, id, true);
    if(changeWorkoutTags) changeWorkoutTags(newTags, id);
    changeNameMode();
    incrementNewSetId();
  }

  function handleDeleteSet({ index, id } : { index: number, id: string }) {
    if(deleteSet) deleteSet(id);
    const newSets = exerciseSets.filter((_, i) => i !== index);
    if(!newSets.length && deleteExercise) deleteExercise();
    else setExerciseSets(newSets);
  }

  function handleNewSet() {
    setExerciseSets(prev => {
      const newSet = {...prev[0]};
      for (const key in newSet) {
        if(newSet[key] !== null) newSet[key] = 0;
      }
      newSet.id = 'set' + newSetId;
      return [...prev, newSet];
    });
    incrementNewSetId();
  }

  return editting ? (
    <div className={styles["exercise-container"]}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
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
          <input readOnly style={{ display: 'none' }} name="name" value={exerciseName}></input>
          <input readOnly style={{ display: 'none' }} name="exerciseId" value={exerciseId}></input>
          <Tooltip title="Remove Exercise">
            <IconButton
              type="button"
              style={{ height: '29px', maxWidth: '29px', padding: '0px' }} 
              onClick={deleteExercise}
            >
              <RemoveIcon style={{
                width: '25px',
                height: '25px',
                backgroundColor: 'red',
                borderRadius: '5px',
                color: 'white', 
                cursor: 'pointer',
                transition: '0.3s'
              }}/>
            </IconButton>
          </Tooltip>
        </div>
        {first ? <AcceptCancel onCancel={cancelEditWorkout} /> : <></>}
      </div>
      {
        <div style={{ display: editting === 'template' && exerciseSelector ? '' : 'none' }}>
          <ExerciseSearchBox
            submitExerciseChange={handleExerciseSelect}
            name={name}
            closed={!exerciseSelector}
            close={() => { setExerciseSelector(false); setExerciseNameHover(false); setExerciseNameClicked(false); }}
          />
        </div>
      }
      <ul style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {exerciseSets.map((set, index) => {
          let last;

          if(set.duration !== null) last = 2;
          else if(set.volume !== null) last = 1;
          else if(set.reps !== null) last = 0;
          return (
            <li key={'set exercise edit' + id + set.id } className={styles["exerciseList"]}>
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
              <button type="button" className={styles["delete-set-button"]} onClick={() => handleDeleteSet({ index: index, id: set.id })}>delete set</button>
            </li>
          );
        })}
      </ul>
      <button
        type="button"
        className={styles["add-set-button"]}
        onClick={handleNewSet}
      >add set</button>
    </div>
  ) : (
    <div className={styles["exercise-container"]}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{
            color: 'black',
            borderRadius: '20px',
            padding: '5px',
            margin: '5px 5px 10px 0px'
        }}>{name}</h2>
        { 
          first ?
          
          <div
            style={{
              color: editWorkoutHovered ? '#1976d2' : 'inherit',
              cursor: 'pointer',
              transition: '0.3s',
              zIndex: '1'
            }}
            onMouseEnter={() => setEditWorkoutHovered(true)}
            onMouseLeave={() => setEditWorkoutHovered(false)}
            onClick={() => editWorkout && editWorkout(true)}
          >
            <BorderColorIcon fontSize="large" sx={{ width: '50px', height: '50px' }}/>
          </div> : <></>
        }
      </div>
      <ul>
        {exerciseSets.map((set, index) => {

          let first;
          if(set.reps!==null) first = 0;
          else if(set.volume!==null) first = 1;
          else if(set.duration!==null) first = 2;
          else if(set.distance!==null) first = 3;

          return (
            <li key={'set exercise display' + id + set.id + index}>
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
