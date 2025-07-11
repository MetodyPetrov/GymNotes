import Autocomplete from '@mui/material/Autocomplete';
import styles from './ExerciseSearchBox.module.css';
import TextField from '@mui/material/TextField';
import DoneIcon from '@mui/icons-material/Done';
import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ExerciseSet, ExerciseTemplate } from '@/app/types/Workout.types';
import { fetchExercisesList, tempFetchExercisesList } from '@/app/requests/fetchs';
import Loading from '@/app/components/Loading/Loading';
import { Modal } from '@mui/material';

type NameBoxProps = {
  submitExerciseChange: (name: string, tags: string[], set: ExerciseSet) => void;
  name?: string;
  close: () => void;
  closed: boolean;
}

export default function ExerciseSearchBox({ submitExerciseChange, name, close, closed } : NameBoxProps) {
  const [textValue, setTextValue] = useState(name !== 'Exercise Name' && name !== '....' ? name : '');
  const [exercises, setExercises] = useState<ExerciseTemplate[]>([]);
  const [fieldPlaceholder, setFieldPlaceholder] = useState('Search input');
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const [offset, setOffset] = useState(0);
  const limit = 12;

  const lastExerciseRef = useRef<HTMLButtonElement>(null);
  const [lastExerciseVisible, setLastExerciseVisible] = useState(false);
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setLastExerciseVisible(entry.isIntersecting), {threshold: 0.1});
    lastExerciseRef.current && observer.observe(lastExerciseRef.current);
    return () => {
      if (lastExerciseRef.current) {
        observer.unobserve(lastExerciseRef.current);
      }
    };
  }, [exercises]);
  useEffect(() => {
    if(lastExerciseVisible) loadExercises();
  }, [lastExerciseVisible]);

  async function loadExercises() {
    try {
      setFieldPlaceholder('Loading exercises...');
      const data = await tempFetchExercisesList(limit, offset);
      setExercises(prev => [...prev, ...data]);
      setOffset(prev => prev + limit);
    } catch (err) {
      alert('Failed to fetch template exercises');
      console.error('Failed to fetch template exercises', err);
    } finally {
      setLoading(false);
      setFieldPlaceholder('Search input');
    }
  }
  useEffect(() => {
    if(!hasLoadedRef.current) {
      hasLoadedRef.current = true;
      loadExercises();
    }
  }, []);

  function handleSubmitName() {
    const exercise = exercises.find(exercise => exercise.name === textValue);

    if(exercise) {
      submitExerciseChange(exercise.name, exercise.tags, { 
        id: 'none',
        reps: exercise.reps ? 0 : null,
        volume: exercise.volume ? 0 : null,
        distance: exercise.distance ? 0 : null,
        duration: exercise.duration ? 0 : null
    });
    }
    else {
      router.push(`${pathname}/exercises/new?name=${encodeURIComponent(textValue || '')}`);
    }
  }
  return (
    <Modal
      open={!closed}
      onClose={close}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <div className={styles["exercises-container"]}>
          <div className={styles["search-confirm-container"]}>
            <Autocomplete
              open={false}
              sx={{ flexGrow: '1' }}
              freeSolo
              id="free-solo-2-demo"
              disableClearable
              options={exercises.map((exercise) => exercise.name)}
              value={textValue}
              onChange={(event, newValue) => setTextValue(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  name="name"
                  label={fieldPlaceholder}
                  value={textValue}
                  onChange={(e) => setTextValue(e.target.value)}
                  slotProps={{
                    input: {
                      ...params.InputProps,
                      type: 'search'
                    }
                  }}
                />
              )}
            />
            <button type="button" className={styles["confirm-button"]} onClick={handleSubmitName}>
              <DoneIcon fontSize='large' />
            </button>
          </div>
          <div className={styles["names-container"]}>
            { loading ? <Loading style={{ color: 'black', fontSize: '1rem' }}>Loading exercises</Loading> :
              exercises.map((exercise, index) => (
                <button
                  type="button"
                  key={'select exercise' + index}
                  className={styles["exercise-button"]}
                  onClick={() => setTextValue(exercise.name)}
                  ref={index === exercises.length - 1 ? lastExerciseRef : null}
                >
                  {exercise.name}
                </button>
              ))
            }
          </div>
      </div>
    </Modal>
  );
}
