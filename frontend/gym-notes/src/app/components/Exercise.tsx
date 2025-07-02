import { ExerciseProps } from "../types/Workout.types";
import RemoveIcon from '@mui/icons-material/Remove';
import styles from "./Exercise.module.css";

function Exercise({ sets, name, editting }: ExerciseProps) {
  return editting ? (
    <div className={styles["exercise-container"]}>
      <h2>{name}</h2>
      <RemoveIcon style={{
        width: '50px',
        height: '50px',
        backgroundColor: 'red',
        borderRadius: '5px',
        color: 'white', 
        cursor: 'pointer',
        transition: '0.3s'
      }}/>
      <ul>
        {sets.map((set, index) => (
          <li key={index} className={styles["exerciseList"]}>
            <input type="number" defaultValue={set.reps || 0} 
            ></input><span> reps – </span><input type="number" defaultValue={set.volume || 0}
            ></input><span> kg – </span><input type="number" defaultValue={set.duration || 0}
            ></input><span> sec/s</span>
          </li>
        ))}
      </ul>
    </div>
  ) : (
    <div className={styles["exercise-container"]}>
      <h2>{name}</h2>
      <ul>
        {sets.map((set, index) => (
          <li key={index}>
            {set.reps || 0}<span> reps – </span>{set.volume || 0}<span> kg – </span>{set.duration || 0}<span> sec/s</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Exercise;
