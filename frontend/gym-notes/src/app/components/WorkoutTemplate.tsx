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
import { usePathname } from "next/navigation";
import TagsBox from "./TagsBox";

const exercisesTemplate: ExerciseModel[] = [
  { id: 'temp-1', name: 'Exercise Name', tags: [ '...' ], sets: [ { volume: 0, duration: 0, reps: 0, distance: 0 }, { volume: 0, duration: 0, reps: 0, distance: 0 }, { volume: 0,duration: 0, reps: 0, distance: 0 } ] }
];

function WorkoutTemplate() {
  const pathname = usePathname();
  const [ newExerciseId, setNewExerciseId ] = useState(0);

  const [ activate, setActivate ] = useState(pathname.includes('template'));
  const [ activateHover, setActivateHover ] = useState(false);
  
  const [ undoHover, setUndoHover ] = useState(false);
  const [ confirmHover, setConfirmHover ] = useState(false);

  const [ exercises, setExercises ] = useState(exercisesTemplate);
  const [ workoutTags, setWorkoutTags ] = useState<string[]>([]);
  const [ tagList, setTagList ] = useState<Record<string, number>>();

  function handleNewExercise() {
    setExercises([...exercises, { id: ('temp' + newExerciseId), name: 'Exercise Name', tags: [], sets: [ { volume: 0, duration: 0, reps: 0, distance: 0 }, { volume: 0, duration: 0, reps: 0, distance: 0 }, { volume: 0,duration: 0, reps: 0, distance: 0 } ] }, ]);
    setNewExerciseId(prev => prev + 1);
  }
  function handleTags(newTags: string[], id: number | string, remove?: boolean) {
    if(!remove) {
      setTagList([...workoutTags, ...newTags].reduce<Record<string, number>>((acc, tag) => {
        acc[tag] = (acc[tag] || 0) + 1;
        return acc;
      }, {}));
      setWorkoutTags([...workoutTags, ...newTags]);

      setExercises(prev => {
        const updated = [...prev];
        for(let i = 0; i < prev.length; i++) {
          if(updated[i].id === id) updated[i].tags = newTags;
        }
        return updated;
      });
    } else {
      setTagList(prev => {
        const updated = { ...prev };
        for(let i = 0; i < newTags.length; i++) {
          updated[newTags[i]]--;
          if(updated[newTags[i]] === 0) delete updated[newTags[i]];
        }
        return updated;
      });

      setWorkoutTags(prev => {
        if(!prev) return prev;
        const updated = [ ...prev ];
        newTags.forEach(tag => {
          const index = prev.indexOf(tag);
          if (index !== -1) {
            updated.splice(index, 1);
          }
        });
        return updated;
      });
    }
  }
  function removeExercise(id: number | string) {
    setExercises(exercises.filter((exercise) => exercise.id !== id));
    const i = exercises.findIndex(exercise => exercise.id === id);
    exercises[i].tags.forEach(tag => {
      handleTags([ tag ], id, true);
    });

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
    let mArr: FormDataEntryValue[] = [];
    let names: FormDataEntryValue[] = [];

    const workoutExercises = exercisesDeepCopy(exercises);
    let currentExercise: number = 0;
    let firstExerciseEncounter: Boolean = false;

    function newExerciseName() {
      workoutExercises[currentExercise].name = names[currentExercise] as unknown as string;
      for(let setIt = 0; setIt < workoutExercises[currentExercise].sets.length; setIt++) {
        workoutExercises[currentExercise].sets[setIt].reps = repArr[setIt] as unknown as number;
        workoutExercises[currentExercise].sets[setIt].volume = kgArr[setIt] as unknown as number;
        workoutExercises[currentExercise].sets[setIt].duration = secArr[setIt] as unknown as number;
        workoutExercises[currentExercise].sets[setIt].distance = mArr[setIt] as unknown as number;
      }

      repArr.length = 0;
      kgArr.length = 0;
      secArr.length = 0;
      mArr.length = 0;

      firstExerciseEncounter = true;
    }

    for (const [key, value] of formData.entries()) {
      if (key.startsWith('rep')) {
        repArr.push(value);
      } else if (key.startsWith('kg')) {
        kgArr.push(value);
      } else if (key.startsWith('duration')) {
        secArr.push(value);
      } else if (key.startsWith('meter')) {
        mArr.push(value);
      } else if (key.startsWith('name')) {
        names.push(value);
        newExerciseName();
        if(!firstExerciseEncounter) currentExercise++;
      }
    }
    currentExercise++;
    newExerciseName();
    
    // api send workoutExercises - tags/id must be added on endpoint
    console.log('mhm', workoutExercises);
    // setActivate(false); 
    // setConfirmHover(false); !!! ENABLE AFTER API IMPLEMENTATION
  }

    return activate ? (
      <form onSubmit={submitWorkout}>
        <div className={styles['template-card-outline']}>
          <div style={{ display: 'flex' }}>
            <div className={styles['template-workout']}>
              {exercises.map((exercise) => (
                <Exercise
                  key={'newWorkoutExercise' + exercise.id}
                  id={exercise.id}
                  sets={exercise.sets}
                  name={exercise.name}
                  editting={'template'}
                  deleteExercise={() => removeExercise(exercise.id)}
                  changeWorkoutTags={handleTags}
                />
              ))}
              <CustomPlusIcon onClick={handleNewExercise}/>
            </div>
            <UndoIcon style={{ 
              width: '50px',
              height: '50px',
              color: undoHover ? 'inherit' : 'white',
              cursor: 'pointer',
              transition: '0.3s'
            }}
              onMouseEnter={() => setUndoHover(true)}
              onMouseLeave={() => setUndoHover(false)}
              onClick={() => {setActivate(false); setUndoHover(false);}}
            />
          </div>
          <div className={styles['tags-container']}>
            {
              tagList && <TagsBox tags={tagList}/>
            }
          </div>
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
        onClick={() => { setActivate(true);setActivateHover(false); setTagList(undefined); setWorkoutTags([]); }}
        onMouseEnter={() => setActivateHover(true)}
        onMouseLeave={() => setActivateHover(false)}
      >
        <AddBoxIcon fontSize="large" style={{ width: '100px', height: '100px', fill: activateHover ? 'white' : 'initial', transition: '0.5s' }}/>
        Add New
      </button>
    );
}

export default WorkoutTemplate;
