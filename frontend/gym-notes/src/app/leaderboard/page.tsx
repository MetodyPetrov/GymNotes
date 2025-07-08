'use client'

import styles from "./Leaderboard.module.css";
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import SpeedIcon from '@mui/icons-material/Speed';
import { useEffect, useState } from "react";
import { fetchLeaderboard, tempFetchLeaderboard } from "../requests/fetchs";
import Loading from "../components/Loading";

enum FetchStatus {
  LOADING, 
  ERRORED,
  COMPLETED
}

export default function Leaderboard() {
  const [loading, setLoading] = useState<FetchStatus>(FetchStatus.LOADING);
  const [leaderboard, setLeaderboard] = useState<any>();

  useEffect(() => {
    async function loadLeaderboard() {
      try {
        const data = await tempFetchLeaderboard();
        setLeaderboard(data);
        setLoading(FetchStatus.COMPLETED);
      } catch (err) {
        alert(err);
        console.error(err);
        setLoading(FetchStatus.ERRORED);
      } 
    }

    loadLeaderboard();
  }, []);
  return (
    loading === FetchStatus.LOADING ? <Loading>Loading</Loading> :
        ( loading === FetchStatus.ERRORED ? <h2>Something went wrong.</h2> :
          
          <div className={styles["leaderboard"]}>
            <div className={styles["record"]}>
              <h2>💪Most Weight Lifted</h2>
              <h1>{leaderboard.mostVolume.name}</h1>
              <h3>{leaderboard.mostVolume.volume.tons + leaderboard.mostVolume.volume.kg}kg lifted!</h3>
            </div>
            <div className={styles["record"]}>
              <h2>Most Sets Done</h2>
              <h1>{leaderboard.mostSets.name}</h1>
              <h3>{leaderboard.mostSets.sets} sets done!</h3>
            </div>
            <div className={styles["record"]}>
              <h2>Most Distance Accumulated</h2>
              <h1>{leaderboard.mostDistance.name}</h1>
              <h3>{leaderboard.mostDistance.distance} km passed!</h3>
            </div>
            <div className={styles["record"]}>
              <h2>Longest Duration Accumulated</h2>
              <h1>{leaderboard.mostDuration.name}</h1>
              <h3>{leaderboard.mostDuration.duration.hours}:{leaderboard.mostDuration.duration.minutes}:{leaderboard.mostDuration.duration.seconds} of exercise!</h3>
            </div>
          </div>
        )
  );
}
