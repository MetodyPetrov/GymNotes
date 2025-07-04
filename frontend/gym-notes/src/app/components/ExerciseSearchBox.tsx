import Autocomplete from '@mui/material/Autocomplete';
import styles from './ExerciseSearchBox.module.css';
import TextField from '@mui/material/TextField';

const exercisesList = [ 
    { name: 'Squat', tags: [ 'Legs' ], reps: true, volume: true, distance: false, duration: false },
    { name: 'Benchpress', tags: [ 'Chest', 'Arms' ], reps: true, volume: true, distance: false, duration: false },
    { name: 'Deadlift', tags: [ 'Legs', 'Chest', 'Back' ], reps: true, volume: true, distance: false, duration: false },
    { name: 'Pull Ups', tags: [ 'Legs' ], reps: true, volume: true, distance: false, duration: false },
    { name: 'Dips', tags: [ 'Legs' ], reps: true, volume: true, distance: false, duration: false },
    { name: 'Chest Flys', tags: [ 'Legs' ], reps: true, volume: true, distance: false, duration: false },
    { name: 'Incline Benchpress', tags: [ 'Legs' ], reps: true, volume: true, distance: false, duration: false },
    { name: 'Lat Pulldowns', tags: [ 'Legs' ], reps: true, volume: true, distance: false, duration: false },
    { name: 'Rear Delt Flys', tags: [ 'Legs' ], reps: true, volume: true, distance: false, duration: false },
]

export default function ExerciseSearchBox() {
    return (
        <div className={styles["exercises-container"]}>
            <Autocomplete
                sx={{ fontSize: '3rem' }} 
                freeSolo
                id="free-solo-2-demo"
                disableClearable
                options={exercisesList.map((exercise) => exercise.name)}
                renderInput={(params) => (
                <TextField
                    {...params}
                    label="Search input"
                    slotProps={{
                    input: {
                        ...params.InputProps,
                        type: 'search',
                    },
                    }}
                />
                )}
            />
            {exercisesList.map((exercise) => (
                <button className={styles["exercise-button"]}>{exercise.name}</button>
            ))}
        </div>
    );
}