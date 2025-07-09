'use client';

import { useEffect, useRef, useState } from "react";
import Exercise from "@/app/components/Exercises/Exercise/Exercise";
import styles from "./WorkoutTemplate.module.css";
import AddBoxIcon from '@mui/icons-material/AddBox';
import UndoIcon from '@mui/icons-material/Undo';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CustomPlusIcon from "@/app/components/CustomPlusIcon";
import Button from "@mui/material/Button";
import { exercisesDeepCopy } from "@/app/helper-functions/deep-copy-builders/functions";
import { ExerciseModel, WorkoutModel } from "@/app/types/Workout.types";
import { usePathname, useRouter } from "next/navigation";
import TagsBox from "@/app/components/Tags/TagsBox";
import { fetchSubmitNewWorkout, tempFetchSubmitNewWorkout } from "@/app/requests/fetchs";

const exercisesTemplate: ExerciseModel[] = [
  { id: 'temp-1', name: 'Exercise Name', tags: [ ], sets: [ 
    { id: -1, volume: 0, duration: 0, reps: 0, distance: 0 },
    { id: -1, volume: 0, duration: 0, reps: 0, distance: 0 },
    { id: -1, volume: 0,duration: 0, reps: 0, distance: 0 } 
  ] }
];

function WorkoutTemplate({ workout } : { workout?: WorkoutModel }) {
  const pathname = usePathname();
  const router = useRouter();
  const elementRef = useRef<HTMLDivElement>(null);
  const [ newExerciseId, setNewExerciseId ] = useState(0);

  const [ activate, setActivate ] = useState(false);
  const [ activateHover, setActivateHover ] = useState(false);
  useEffect(() => {
    setActivate(pathname.includes('template'));
  }, [pathname]);
  // useEffect(() => {
  //   if(activate) {
  //     elementRef.current?.scrollTo(0,0);
  //   }
  // }, [activate]);
  
  const [ undoHover, setUndoHover ] = useState(false);
  const [ confirmHover, setConfirmHover ] = useState(false);

  const [ exercises, setExercises ] = useState(workout ? workout.exercises : exercisesTemplate);
  useEffect(() => {
    setExercises(workout ? workout.exercises : exercisesTemplate);
  }, [workout]);
  const [ workoutTags, setWorkoutTags ] = useState<string[]>([]);

  function handleNewExercise() {
    setExercises([...exercises, { id: ('temp' + newExerciseId), name: 'Exercise Name', tags: [], sets: [ { volume: 0, duration: 0, reps: 0, distance: 0 }, { volume: 0, duration: 0, reps: 0, distance: 0 }, { volume: 0,duration: 0, reps: 0, distance: 0 } ] }, ]);
    setNewExerciseId(prev => prev + 1);
  }
  function handleTags(newTags: string[], id: number | string, remove?: boolean) {
    if(!remove) {
      setWorkoutTags(prev => {
        return [...prev, ...newTags];
      });

      setExercises(prev => {
        const updated = [ ...prev ];
        for(let i = 0; i < prev.length; i++) {
          if(updated[i].id === id) updated[i].tags = newTags;
        }
        return updated;
      });
    } else {
      setWorkoutTags(prev => {
        if(!prev) return prev;
        const updated = [ ...prev ];
        newTags.forEach(tag => {
          const index = updated.indexOf(tag);
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

  async function submitWorkout(event?: React.FormEvent<HTMLFormElement>) {
    event?.preventDefault();

    const form = event?.currentTarget;
    const formData = new FormData(form);

    let repArr: FormDataEntryValue[] = [];
    let kgArr: FormDataEntryValue[] = [];
    let secArr: FormDataEntryValue[] = [];
    let mArr: FormDataEntryValue[] = [];
    let nameArr: FormDataEntryValue[] = [];

    const tempExercisesList = exercisesDeepCopy(exercises);
    let exerciseIt: number = 0;
    let firstEncounter: boolean = true;

    function newExerciseName() {
      if(firstEncounter) {
        firstEncounter = false;
        return;
      }
      for(let setIt = 0; setIt < tempExercisesList[exerciseIt].sets.length; setIt++) {
        tempExercisesList[exerciseIt].sets[setIt].reps = repArr[setIt] as unknown as number || null;
        tempExercisesList[exerciseIt].sets[setIt].volume = kgArr[setIt] as unknown as number || null;
        tempExercisesList[exerciseIt].sets[setIt].duration = secArr[setIt] as unknown as number || null;
        tempExercisesList[exerciseIt].sets[setIt].distance = mArr[setIt] as unknown as number || null;
      }
      exerciseIt++;

      repArr.length = 0;
      kgArr.length = 0;
      secArr.length = 0;
      mArr.length = 0;
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
      } else if (key === 'name') {
        nameArr.push(value);
        newExerciseName();
      }
    }
    for(let i = 0; i < tempExercisesList.length; i++) {
      tempExercisesList[i].name = nameArr[i] as string;
      if(tempExercisesList[i].name === '') {
        alert('Incorrect data');
        return;
      }
    }
    newExerciseName();
    
    // api send workoutExercises - tags/id must be added on endpoint
    try {
      await tempFetchSubmitNewWorkout(tempExercisesList);
    } catch (err) {
      alert(err);
      console.error(err);
    }
    console.log('mhm', tempExercisesList);
    setActivate(false); 
    setConfirmHover(false);
  }

  function handleFormActivate() {
    setActivateHover(false);
    setWorkoutTags([]);
    router.push('/my-workouts/template');
  }

  function handleUndoClick() {
    setActivate(false);
    setUndoHover(false);
    router.push('/my-workouts');
  }

    return activate ? (
      <form onSubmit={submitWorkout}>
        <div className={styles['template-card-outline']} ref={elementRef}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div className={styles['template-workout']}>
              {exercises.map((exercise) => (
                <Exercise
                  key={'newWorkoutExercise' + exercise.id}
                  id={exercise.id}
                  sets={exercise.sets}
                  tags={exercise.tags}
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
              onClick={handleUndoClick}
            />
          </div>
          <div className={styles['tags-container']}>
            {
              workoutTags.length ? <TagsBox tags={workoutTags}/> : <></>
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
          padding: '20px',
          width: 'fit-content'
        }}
        onClick={handleFormActivate}
        onMouseEnter={() => setActivateHover(true)}
        onMouseLeave={() => setActivateHover(false)}
      >
        <AddBoxIcon fontSize="large" style={{ width: '100px', height: '100px', fill: activateHover ? 'white' : 'initial', transition: '0.5s' }}/>
        New Workout
      </button>
    );
}

export default WorkoutTemplate;
