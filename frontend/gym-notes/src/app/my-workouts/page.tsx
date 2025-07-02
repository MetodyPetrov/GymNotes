import Workout from '../components/Workout';
import WorkoutTemplate from '../components/WorkoutTemplate';

const exercises = [
{ name: 'Squat', tags: [ 'Legs' ], sets: [ { volume: 100, reps: 12 }, { volume: 90, reps: 12 }, { volume: 90, reps: 8 } ] },
{ name: 'Squat', tags: [ 'Legs' ], sets: [ { volume: 100, reps: 12 }, { volume: 90, reps: 12 }, { volume: 90, reps: 8 } ] },
{ name: 'Squat', tags: [ 'Legs' ], sets: [ { volume: 100, reps: 12 }, { volume: 90, reps: 12 }, { volume: 90, reps: 8 } ] },
];

export default function PersonalWorkoutsPage() {
  return (
    <>
      <WorkoutTemplate />
      <Workout exercises={exercises}/>
      <Workout exercises={exercises}/>
    </>
  );
}
