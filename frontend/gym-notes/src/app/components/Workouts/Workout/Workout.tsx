'use client';

import { useEffect, useState } from 'react';
import Exercise from "@/app/components/Exercises/Exercise/Exercise";
import styles from "./Workout.module.css";
import { ExerciseModel, ExerciseSet, WorkoutProps } from '@/app/types/Workout.types';
import CustomPlusIcon from '@/app/components/CustomPlusIcon';

import { exercisesDeepCopy } from '@/app/helper-functions/deep-copy-builders/functions';
import TagsBox from '@/app/components/Tags/TagsBox';
import { compareWorkouts } from '@/app/helper-functions/functions';
import { fetchAddDislike, fetchAddLike, fetchRemoveDislike, fetchRemoveLike, fetchUpdateWorkout, tempFetchAddDislike, tempFetchAddLike, tempFetchRemoveDislike, tempFetchRemoveLike, tempFetchUpdateWorkout } from '@/app/requests/fetchs';
import { AddCircleOutline, ThumbDown, ThumbUp } from '@mui/icons-material';
import { Button } from '@mui/material';
import { useRouter } from 'next/navigation';

function Workout({ id, likes, dislikes, hasLiked, hasDisliked, exercises, date, personal, removeWorkout }: WorkoutProps) {
  const router = useRouter();

  const [exercisesList, setExercisesList] = useState(exercisesDeepCopy(exercises));
  const [workoutTags, setWorkoutTags] = useState<string[]>([]);
  
  const [copyWorkoutHovered, setCopyWorkoutHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(hasLiked);
  const [isDisliked, setIsDisliked] = useState(hasDisliked);
  const [likesQuantity, setLikesQuantity] = useState(likes);
  const [dislikesQuantity, setDislikesQuantity] = useState(dislikes);

  const [tempId, setTempId] = useState(0);
  const [tempSetId, setTempSetId] = useState(50);

  const [formEdit, setFormEdit] = useState(false);

  const [currentExercises, setCurrentExercises] = useState<ExerciseModel[]>([]);

  function resetTags(list: string[]) {
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

    let repArr: FormDataEntryValue[] = [];
    let kgArr: FormDataEntryValue[] = [];
    let secArr: FormDataEntryValue[] = [];
    let mArr: FormDataEntryValue[] = [];
    let nameArr: FormDataEntryValue[] = [];

    const tempExercisesList: ExerciseModel[] = [];
    let exerciseIt: number = 0;
    let firstEncounter: boolean = true;

    function newExerciseName() {
      if(firstEncounter) {
        firstEncounter = false;
        return;
      }
      for(let setIt = 0; setIt < Math.max(repArr.length, kgArr.length, secArr.length, mArr.length); setIt++) {
        // if(!tempExercisesList[exerciseIt]) tempExercisesList[exerciseIt] = {} as ExerciseModel;
        console.log(tempExercisesList[exerciseIt]); // WTF???
        if(!tempExercisesList[exerciseIt].sets) tempExercisesList[exerciseIt].sets = [] as ExerciseSet[];
        if(!tempExercisesList[exerciseIt].sets[setIt]) tempExercisesList[exerciseIt].sets[setIt] = { id: tempSetId + 1 + setIt + ' newExercise' } as ExerciseSet;
        tempExercisesList[exerciseIt].sets[setIt] = { id: tempExercisesList[exerciseIt].sets[setIt].id, reps: 0, volume: 0, duration: 0, distance: 0 };
        tempExercisesList[exerciseIt].sets[setIt].reps = repArr[setIt] as unknown as number || null;
        tempExercisesList[exerciseIt].sets[setIt].volume = kgArr[setIt] as unknown as number || null;
        tempExercisesList[exerciseIt].sets[setIt].duration = secArr[setIt] as unknown as number || null;
        tempExercisesList[exerciseIt].sets[setIt].distance = mArr[setIt] as unknown as number || null;
      }
      setTempSetId(prev => prev + 10 + Math.max(repArr.length, kgArr.length, secArr.length, mArr.length));
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

    for(let i = 0; i < tempExercisesList.length; i++) {
      const lastIndex = tempExercisesList[i].sets.reduce((last, set, index) => {
        const hasString = ['reps', 'volume', 'duration', 'distance'].some( key => typeof set[key] === 'string' );
        return hasString ? index : last;
      }, -1);

      if(lastIndex !== -1) tempExercisesList[i].sets.length = lastIndex + 1;
    }
    
    // WE IMPLEMENT WORKOUT COMPARISON HERE AND SEND THE CHANGED/DELETED/NEW SETS
    console.log(tempExercisesList, currentExercises);
    try {
      await tempFetchUpdateWorkout(tempExercisesList, id);
    } catch(err) {
      alert(err);
      console.error(err);
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
    const setIds = tempSetId + 3;
    setExercisesList([...exercisesList, 
      {
        id: 'tempExistingWorkout' + tempId,
        name: '....',
        tags: [  ],
        sets: [ 
          { id: setIds, reps: 0, volume: 0, distance: 0, duration: 0 },
          { id: setIds + 1, reps: 0, volume: 0, distance: 0, duration: 0 },
          { id: setIds + 2, reps: 0, volume: 0, distance: 0, duration: 0 }
        ]
      }
    ]);
    setTempId(prev => prev + 1);
    setTempId(prev => prev + (setIds - prev) + 10);
  }
  function handleTags(newTags: string[], id: number | string, remove?: boolean) {
    if(!remove) {
      setWorkoutTags(prev => {
        return [...prev, ...newTags];
      });

      setExercisesList(prev => {
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
  function handleDiscardChanges() {
    setFormEdit(false);
    setExercisesList(exercisesDeepCopy(currentExercises));

    const tags: string[] = [];
    currentExercises.forEach(exercise => tags.push(...exercise.tags));
    resetTags(tags);
  }
  async function handleLike() {
    const prev = { like: isLiked, dislike: isDisliked, likesCount: likesQuantity, dislikesCount: dislikesQuantity };
    try {
      if(isLiked) {
        setLikesQuantity(prev => prev - 1);
        setIsLiked(false);
        await tempFetchRemoveLike(id);
      } else {
        setLikesQuantity(prev => prev + 1);
        isDisliked && handleDislike();
        setIsDisliked(false);
        setIsLiked(true);
        await tempFetchAddLike(id);
      }
    } catch (err) {
      setIsDisliked(prev.dislike);
      setIsLiked(prev.like);
      setDislikesQuantity(prev.dislikesCount);
      setLikesQuantity(prev.likesCount);
      alert(err);
      console.error(err);
    }
  }
  async function handleDislike() {
    const prev = { like: isLiked, dislike: isDisliked, likesCount: likesQuantity, dislikesCount: dislikesQuantity };
    try {
      if(isDisliked) {
        setDislikesQuantity(prev => prev - 1);
        setIsDisliked(false);
        await tempFetchRemoveDislike(id);
      } else {
        setDislikesQuantity(prev => prev + 1);
        isLiked && handleLike();
        setIsLiked(false);
        setIsDisliked(true);
        await tempFetchAddDislike(id);
      }
    } catch (err) {
      setIsDisliked(prev.dislike);
      setIsLiked(prev.like);
      setDislikesQuantity(prev.dislikesCount);
      setLikesQuantity(prev.likesCount);
      alert(err);
      console.error(err);
    }
  }
  function handleCopyWorkout() {
    router.push(`/my-workouts/template/?workout-id=${encodeURIComponent(id)}`);
  }
  
    return formEdit ? (
      <form onSubmit={submitChanges}>
        <div className={styles['selected-card-outline']} style={{ position: 'relative' }}>
          <div>
            {exercisesList.map((exercise) => (
              <Exercise
                first={exercise.id === exercisesList[0].id}
                cancelEditWorkout={handleDiscardChanges}
                id={exercise.id}
                newSetId={tempSetId + 'workoutSet edit'}
                key={'exercise' + exercise.id}
                sets={exercise.sets}
                name={exercise.name}
                tags={exercise.tags}
                editting={formEdit && exercise.name === "...." ? "template" : formEdit}
                deleteExercise={() => handleExerciseDeletion(exercise.id)}
                changeWorkoutTags={handleTags}
                incrementNewSetId={() => setTempSetId(prev => prev + 1)}
              />
            ))}
          </div>
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
          { workoutTags.length ? 
            <div style={{
                display: 'flex',
                padding: '20px 0px 20px 0px',
              }}
            >
              <TagsBox tags={workoutTags} theme='black' bgColor='#fb0' labelColor='white'/>
            </div> : <></>
          }
        </div>
      </form>
    ) : (
      <div className={styles['card-outline']} style={{ position: 'relative' }}>
        {exercisesList.map((exercise) => (
          <Exercise
            first={exercise.id === exercisesList[0].id && personal}
            editWorkout={(value: boolean) => setFormEdit(value)}
            id={exercise.id}
            newSetId={tempSetId + 'workoutSet no-edit'}
            key={'exerciseshow' + exercise.id}
            sets={exercise.sets}
            name={exercise.name}
            tags={exercise.tags}
            incrementNewSetId={() => setTempSetId(prev => prev + 1)}
          />
        ))}
        <h5 style={{ fontWeight: '500', fontSize: '1rem', position:'absolute', top: '5px', left: '60px', color: '#003a7e' }}>Date: {date.format().split('T')[0]}</h5>
        { workoutTags.length ?  
          <div style={{
              display: 'flex',
              padding: '20px 0px 20px 0px',
            }}
          >
            <TagsBox tags={workoutTags} theme='black' bgColor='white' labelColor='white'/>
          </div> : <></>
        }
        <div style={{ display: 'flex', justifyContent: 'space-between', textAlign: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Button 
              onClick={handleCopyWorkout}
              style={{ borderRadius: '50px', color: copyWorkoutHovered ? '' : 'black', transition: '0.3s' }}
              onMouseEnter={() => setCopyWorkoutHovered(true)}
              onMouseLeave={() => setCopyWorkoutHovered(false)}
            >
              <AddCircleOutline sx={{ width: '50px', height: '50px' }}/>
            </Button>
            <h6 style={{ fontSize: '0.8rem', color: copyWorkoutHovered ? '#1976d2' : 'black', transition: '0.3s' }}>Copy workout</h6>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div>
              <Button onClick={handleLike} style={{ color: isLiked ? '' : 'black', borderRadius: '50px' }}>
                <ThumbUp sx={{ width: '50px', height: '50px' }}/>
              </Button>
              <h6 style={{ fontSize: '0.8rem' }}>{likesQuantity}</h6>
            </div>
            <div>
              <Button onClick={handleDislike} style={{ color: isDisliked ? '' : 'black', borderRadius: '50px' }}>
                <ThumbDown sx={{ width: '50px', height: '50px' }}/>
              </Button>
              <h6 style={{ fontSize: '0.8rem' }}>{dislikesQuantity}</h6>
            </div>
          </div>
        </div>
      </div>
  );
}

export default Workout;
