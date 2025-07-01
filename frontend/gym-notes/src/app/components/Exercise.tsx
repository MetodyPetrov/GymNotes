type ExerciseSet = {
  volume?: number;
  duration?: number;
  reps?: number;
};

type ExerciseProps = {
  name: string;
  sets: ExerciseSet[];
  displayVolume?: boolean;
  displayDuration?: boolean;
  displayReps?: boolean
};

function Exercise({ sets, name, displayVolume = false, displayDuration = false, displayReps = false }: ExerciseProps) {
  return (
    <div style={{color: '#0c0088', fontSize: '32px'}}>
      <h2>{name}</h2>
      <ul>
        {sets.map((set, index) => (
          <li key={index}>
            {set.reps || (displayReps ? 0 : 'no')} reps – {set.volume || (displayVolume ? 0 : 'no')} kg – {set.duration || (displayDuration ? 0 : 'no')} sec/s
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Exercise;
