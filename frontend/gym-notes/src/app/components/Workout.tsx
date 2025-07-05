'use client';

import { useEffect, useState } from 'react';
import Exercise from "./Exercise";
import styles from "./Workout.module.css";
import BorderColorIcon from '@mui/icons-material/BorderColor';
import DoneIcon from '@mui/icons-material/Done';
import ClearIcon from '@mui/icons-material/Clear';
import { ExerciseModel, WorkoutProps } from '../types/Workout.types';
import CustomPlusIcon from './CustomPlusIcon';

import { exercisesDeepCopy } from '../helper-functions/deep-copy-builders/functions';
import TagsBox from './TagsBox';
import { compareWorkouts } from '../helper-functions/functions';
import { fetchUpdateWorkout, tempFetchUpdateWorkout } from '../requests/fetchs';

function Workout({ id, exercises, date, removeWorkout }: WorkoutProps) {
  const [hovered, setHovered] = useState(false);

  const [checkHovered, setCheckHovered] = useState(false);
  const [cancelHovered, setCancelHovered] = useState(false);

  const [exercisesList, setExercisesList] = useState(exercisesDeepCopy(exercises));
  const [workoutTags, setWorkoutTags] = useState<string[]>([]);
  const [tagList, setTagList] = useState<Record<string, number>>({});

  const [tempId, setTempId] = useState(0);

  const [formEdit, setFormEdit] = useState(false);

  const [currentExercises, setCurrentExercises] = useState<ExerciseModel[]>([]);

  function resetTags(list: string[]) {
    setTagList(list.reduce<Record<string, number>>((acc, tag) => {
      acc[tag] = (acc[tag] || 0) + 1;
      return acc;
    }, {}));
    setWorkoutTags(list);
  }

  useEffect(() => {
    const copiedExercises = exercisesDeepCopy(exercisesList);
    setCurrentExercises(copiedExercises);

    const tempWorkoutTags: string[] = [];
    exercises.forEach(exercise => {
      tempWorkoutTags.push(...exercise.tags);
    });
    resetTags(tempWorkoutTags);
  }, []);


  async function submitChanges(event?: React.FormEvent<HTMLFormElement>) {
    event?.preventDefault();

    const form = event?.currentTarget;
    const formData = new FormData(form);
    // api

    let repArr: FormDataEntryValue[] = [];
    let kgArr: FormDataEntryValue[] = [];
    let secArr: FormDataEntryValue[] = [];
    let mArr: FormDataEntryValue[] = [];
    let nameArr: FormDataEntryValue[] = [];

    const tempExercisesList = exercisesDeepCopy(exercisesList);
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
    for(let i = 0; i < tempExercisesList.length; i++) tempExercisesList[i].name = nameArr[i] as string;
    newExerciseName();
    
    if(!compareWorkouts(tempExercisesList, currentExercises)) {
      try {
        await tempFetchUpdateWorkout(tempExercisesList, id);
      } catch(err) {
        alert(err);
        console.error(err);
      }
    }

    setFormEdit(false);
    setExercisesList(tempExercisesList);
    setCurrentExercises(exercisesDeepCopy(tempExercisesList));
    
    console.log('yeah', tempExercisesList);
  }
  function handleExerciseDeletion(exerciseId: number | string) {
    setExercisesList(exercisesList.filter((exercise) => exercise.id !== exerciseId));
    const i = exercisesList.findIndex(exercise => exercise.id === exerciseId);
    exercisesList[i].tags.forEach(tag => {
      handleTags([ tag ], exerciseId, true);
    });
    if(exercisesList.length === 1) {
      removeWorkout(id);
      // modal asking if the person's sure they want to remove the workout
    }
  }

  function handleNewExercise() {
    setExercisesList([...exercisesList, 
      {
        id: 'tempExistingWorkout' + tempId,
        name: '....',
        tags: [  ],
        sets: [ 
          { reps: 0, volume: 0, distance: 0, duration: 0 },
          { reps: 0, volume: 0, distance: 0, duration: 0 },
          { reps: 0, volume: 0, distance: 0, duration: 0 }
        ]
      }
    ]);
    setTempId(prev => prev + 1);
  }
  function handleTags(newTags: string[], id: number | string, remove?: boolean) {
    if(!remove) {
      setTagList([...workoutTags, ...newTags].reduce<Record<string, number>>((acc, tag) => {
        acc[tag] = (acc[tag] || 0) + 1;
        return acc;
      }, {}));
      setWorkoutTags([...workoutTags, ...newTags]);

      setExercisesList(prev => {
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
  function handleDiscardChanges() {
    setFormEdit(false);
    setExercisesList(exercisesDeepCopy(currentExercises));

    const tags: string[] = [];
    currentExercises.forEach(exercise => tags.push(...exercise.tags));
    resetTags(tags);
  }
  
    return formEdit ? (
      <form onSubmit={submitChanges}>
        <div className={styles['selected-card-outline']} style={{ position: 'relative' }}>
          <div>
            <div
              style={{
                position: 'absolute',
                top: '30px',
                right: '30px',
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
                  cursor: 'pointer',
                  zIndex: '1'
                }}
                type='submit'
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
                  cursor: 'pointer',
                  zIndex: '1'
                }}
                
                type='button'
                onMouseEnter={() => setCancelHovered(true)}
                onMouseLeave={() => setCancelHovered(false)}
                onClick={handleDiscardChanges}
              >
                <ClearIcon fontSize='large'/>
              </button>
            </div>
            {exercisesList.map((exercise) => (
              <Exercise
                id={exercise.id}
                key={'exercise' + exercise.id}
                sets={exercise.sets}
                name={exercise.name}
                editting={formEdit && exercise.name === "...." ? "template" : formEdit}
                deleteExercise={() => handleExerciseDeletion(exercise.id)}
                changeWorkoutTags={handleTags}
              />
            ))}
          </div>
          <CustomPlusIcon onClick={handleNewExercise}/>
          { tagList && 
            <div style={{
                display: 'flex',
                padding: '20px 0px 20px 0px',
              }}
            >
              <TagsBox tags={tagList} theme='black' bgColor='#fb0' labelColor='white'/>
            </div>
          }
        </div>

      </form>
    ) : (
      <div className={styles['card-outline']} style={{ position: 'relative' }}>
        <div
          style={{
            position: 'absolute',
            top: '20px',
            right: '30px',
            color: hovered ? '#1976d2' : 'inherit',
            cursor: 'pointer',
            transition: '0.3s',
            zIndex: '1'
          }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onClick={() => setFormEdit(true)}
        >
          <BorderColorIcon fontSize="large" sx={{ width: '50px', height: '50px' }}/>
        </div>
        {exercisesList.map((exercise) => (
          <Exercise id={exercise.id} key={'exerciseshow' + exercise.id} sets={exercise.sets} name={exercise.name} />
        ))}
        <h5 style={{ fontWeight: '500', fontSize: '1rem', position:'absolute', top: '5px', left: '60px', color: '#003a7e' }}>Date: {date.format().split('T')[0]}</h5>
        { tagList && 
          <div style={{
              display: 'flex',
              padding: '20px 0px 20px 0px',
            }}
          >
            <TagsBox tags={tagList} theme='black' bgColor='white' labelColor='white'/>
          </div>
        }
      </div>
  );
}

export default Workout;
