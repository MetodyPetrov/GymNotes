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
    { id: 'temp-1 set0', volume: 0, duration: 0, reps: 0, distance: 0 },
    { id: 'temp-1 set1', volume: 0, duration: 0, reps: 0, distance: 0 },
    { id: 'temp-1 set2', volume: 0, duration: 0, reps: 0, distance: 0 }
  ] }
];

function WorkoutTemplate({ workout } : { workout?: WorkoutModel }) {
  const pathname = usePathname();
  const activate = pathname.includes('template');
  const router = useRouter();
  const elementRef = useRef<HTMLDivElement>(null);
  const [ newExerciseId, setNewExerciseId ] = useState(11);
  const [ newSetId, setNewSetId ] = useState(50);
  
  const [ undoHover, setUndoHover ] = useState(false);
  const [ confirmHover, setConfirmHover ] = useState(false);

  const [ exercises, setExercises ] = useState(workout ? workout.exercises : exercisesTemplate);
  useEffect(() => {
    setExercises(workout ? workout.exercises : exercisesTemplate);
  }, [workout]);
  const [ workoutTags, setWorkoutTags ] = useState<string[]>([]);

  const lastestSetId = ('temp' + newExerciseId + ' set' + newSetId);
  const latestExerciseId = ('temp-' + newExerciseId);

  function handleNewExercise() {
    setNewExerciseId(prev => prev + 1);
    setNewSetId(prev => prev + 1);
    setExercises([...exercises, { id: latestExerciseId, name: 'Exercise Name', tags: [], sets: [ { id: lastestSetId, volume: 0, duration: 0, reps: 0, distance: 0 } ] }, ]);
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
        router.push('/my-workouts');
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
      for(let setIt = 0; setIt < Math.max(repArr.length, kgArr.length, secArr.length, mArr.length); setIt++) {
        tempExercisesList[exerciseIt].sets[setIt] = { id: -1, reps: 0, volume: 0, duration: 0, distance: 0 };
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
    router.push('/my-workouts');
    setConfirmHover(false);
  }

  function handleFormActivate() {
    setWorkoutTags([]);
    router.push('/my-workouts/template');
  }

  function handleUndoClick() {
    setUndoHover(false);
    setExercises(exercisesTemplate);
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
                newSetId={lastestSetId}
                sets={exercise.sets}
                tags={exercise.tags}
                name={exercise.name}
                editting={'template'}
                deleteExercise={() => removeExercise(exercise.id)}
                changeWorkoutTags={handleTags}
                incrementNewSetId={() => setNewSetId(prev => prev + 1)}
              />
            ))}
            <div style={{ marginTop: '40px' }}>
              <CustomPlusIcon onClick={handleNewExercise}/>
              <h5 style={{
                  fontSize: '1rem',
                  color: 'white',
                  backgroundColor: 'green', 
                  width: 'fit-content',
                  border: 'solid white 2px'
                }}
              >add exercise</h5>
            </div>
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
      className={styles["activate-button"]}
      onClick={handleFormActivate}
    >
      <AddBoxIcon fontSize="large" style={{ width: '100px', height: '100px' }}/>
      New Workout
    </button>
  );
}

export default WorkoutTemplate;
