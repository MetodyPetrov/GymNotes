'use client'

import styles from "./Leaderboard.module.css";
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import SpeedIcon from '@mui/icons-material/Speed';
import { useEffect, useState } from "react";
import { fetchLeaderboard, tempFetchLeaderboard } from "@/app/requests/fetchs";
import Loading from "@/app/components/Loading/Loading";
import { useRouter } from "next/navigation";

enum FetchStatus {
  LOADING, 
  ERRORED,
  COMPLETED
}

export default function Leaderboard() {
  const [loading, setLoading] = useState<FetchStatus>(FetchStatus.LOADING);
  const [leaderboard, setLeaderboard] = useState<any>();
  const router = useRouter();

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
              <div className={styles["record-type-box"]}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 101.17 122.88"
                  fill="#ff990a"
                  width="32"
                  height="32"
                >
                  <path d="M71.79 82.29c.48.21.84.59 1.02 1.04.18.45.19.97-.01 1.45-.21.48-.59.84-1.04 1.02-.45.18-.97.19-1.45-.01-2.79-1.19-5.11-3.03-7.06-5.41-1.92-2.35-3.46-5.23-4.68-8.54-2.87-1.77-5.66-3.1-8.37-3.99-2.73-.9-5.38-1.37-7.95-1.39-2.44-.03-4.82.33-7.15 1.08-2.23.72-4.41 1.79-6.54 3.21 1.22 1.09 2.34 2.3 3.35 3.63 1.08 1.42 2.03 2.98 2.86 4.68.23.47.25.99.09 1.45l-.01.02c-.16.45-.49.84-.96 1.07-.47.23-.99.25-1.45.09l-.02-.01c-.45-.16-.84-.49-1.07-.96-1.2-2.46-2.7-4.58-4.49-6.35-1.79-1.78-3.87-3.22-6.23-4.34-2.42-1.15-5.14-1.97-8.14-2.48-3.01-.51-6.3-.71-9.87-.61-.52.01-1-.19-1.36-.52-.35-.33-.58-.8-.59-1.33-.01-.52.19-1 .52-1.36.33-.35.8-.58 1.33-.59 3.86-.11 7.44.11 10.73.68 3.3.57 6.3 1.49 9 2.77.58.27 1.14.56 1.68.87.5.28.98.57 1.45.87 2.63-1.9 5.34-3.32 8.13-4.27 2.84-.97 5.76-1.43 8.77-1.4 2.44.03 4.93.39 7.46 1.09 2.37.65 4.77 1.6 7.22 2.84-.07-.3-.15-.59-.22-.89-.11-.48-.22-.97-.33-1.48-1.01-4.76-1.62-10.1-1.97-15.82-.34-5.6-.43-11.58-.38-17.75-4.65 1.58-9.25 3.15-13.92 4.67-1.65.74-3.17 1.11-4.57 1.12-1.41.02-2.7-.32-3.87-.97-1.11-.61-2.08-1.5-2.93-2.62-.84-1.11-1.57-2.45-2.19-3.98-1.36-2.19-2.76-4.38-4.08-6.58-1.07-1.79-1.68-3.5-1.83-5.14-.14-1.65.19-3.22 1-4.71.75-1.39 1.91-2.66 3.5-3.83 1.57-1.15 3.54-2.2 5.93-3.14 4.47-1.53 9.2-3.12 13.71-4.49 1.69-.61 3.33-.94 4.91-.98 1.59-.04 3.12.21 4.59.77 1.41.54 2.75 1.35 4.01 2.45 1.24 1.09 2.4 2.46 3.48 4.12 5.74 3.66 10.7 8.2 14.96 13.54 4.26 5.35 7.81 11.49 10.73 18.33 2.91 6.81 5.2 14.32 6.94 22.42 1.74 8.09 2.94 16.78 3.68 25.97 1.3 3.74 2.26 7.12 2.73 10.13.48 3.04.46 5.69-.19 7.93-.7 2.45-2.08 4.38-4.26 5.76-2.16 1.36-5.11 2.17-8.99 2.39-9.54 2.43-18.54 4.4-26.96 5.87-8.43 1.48-16.27 2.46-23.49 2.91-7.3.45-13.96.35-19.94-.33-5.98-.69-11.28-1.97-15.85-3.88-.48-.2-.84-.58-1.03-1.03-.19-.45-.2-.97 0-1.45.2-.48.58-.84 1.03-1.03.45-.19.97-.2 1.45 0 4.28 1.79 9.29 2.99 14.99 3.64 5.7.64 12.09.73 19.11.3 7.09-.44 14.82-1.41 23.16-2.88 8.33-1.46 17.26-3.42 26.74-5.84.02 0 .03-.01.05-.01.05-.01.09-.02.14-.03 2.67-.4 4.62-.22 7.14-1.65 1.6-.91 2.58-2.18 3.04-3.79.52-1.8.49-4.05.04-6.71-.46-2.67-1.35-5.75-2.55-9.18-.04-.09-.07-.19-.1-.29-.02-.1-.04-.2-.05-.31-.72-9.06-1.89-17.6-3.59-25.54-1.7-7.94-3.92-15.27-6.75-21.89-2.8-6.56-6.2-12.43-10.27-17.53-4.07-5.09-8.8-9.4-14.28-12.84-.12-.07-.24-.17-.34-.27-.1-.1-.19-.22-.27-.34l-.01-.02c-.88-1.41-1.82-2.56-2.79-3.45-.97-.89-1.99-1.53-3.05-1.93-1.03-.39-2.11-.56-3.26-.52-1.15.04-2.36.29-3.63.75-4.54 1.51-9.1 2.98-13.64 4.47-1.96.77-3.56 1.6-4.8 2.47-1.23.87-2.1 1.78-2.62 2.73-.46.85-.63 1.78-.51 2.78.12 1.02.54 2.13 1.26 3.32l4.12 6.65.02.04.07.12.06.14.01.02c.47 1.19.99 2.2 1.58 3.02.58.81 1.21 1.42 1.91 1.81.64.35 1.36.52 2.19.48.85-.04 1.8-.29 2.88-.77.04-.02.09-.04.14-.06.05-.02.1-.04.15-.06l1.73-.56c.45-1.85.88-3.37 1.23-4.6l.01-.02c.29-1.02.55-1.74.72-2.21.11-.31.25-.35.21-.41-.03-.04-.14.16-.49.4-.65.46-1.74 1.22-3.62 1.98l-.88.35c-.49.2-1.01.17-1.45-.02-.45-.19-.82-.55-1.02-1.04 0 0 0 0 0 0-.19-.49-.17-1 .02-1.45.19-.45.55-.82 1.04-1.02.29-.12.59-.23.88-.35 5.13-2.07 7.34-2.95 8.67-.97.85 1.26.38 2.9-.43 5.77l-.01.04c-.18.63-.38 1.34-.59 2.12l10.46-3.56.04-.01c.09-.03.18-.05.27-.06.1-.02.21-.02.32-.02.52.01 1 .22 1.34.57.34.35.55.82.54 1.35-.09 6.61-.04 13.02.28 19.01.32 5.98.93 11.53 1.96 16.42.99 4.69 2.37 8.75 4.28 11.97 2.01 3.33 4.43 5.69 7.5 7.01z"/>
                </svg>

                <h2 className={styles["record-type"]}>Weight</h2>
              </div>
              <h1 className={styles["record-holder"]} onClick={() => router.push(`/explore/users/${leaderboard.mostVolume.id}`)}>{leaderboard.mostVolume.name}</h1>
              <h3 className={styles["record-value"]}><span className={styles["value"]}>{leaderboard.mostVolume.volume.tons + '' + leaderboard.mostVolume.volume.kg}</span>kg lifted!</h3>
            </div>
            <div className={styles["record"]}>
              <div className={styles["record-type-box"]}>
                <MilitaryTechIcon sx={{ width: "32px", height: '32px', color: "#ff990a" }}/>
                <h2 className={styles["record-type"]}>Sets</h2>
              </div>
              <h1 className={styles["record-holder"]} onClick={() => router.push(`/explore/users/${leaderboard.mostSets.id}`)}>{leaderboard.mostSets.name}</h1>
              <h3 className={styles["record-value"]}><span className={styles["value"]}>{leaderboard.mostSets.sets}</span>sets done!</h3>
            </div>
            <div className={styles["record"]}>
              <div className={styles["record-type-box"]}>
                <DirectionsRunIcon sx={{ width: "32px", height: "32px", color: "#ff990a" }}/>
                <h2 className={styles["record-type"]}>Distance</h2>
              </div>
              <h1 className={styles["record-holder"]} onClick={() => router.push(`/explore/users/${leaderboard.mostDistance.id}`)}>{leaderboard.mostDistance.name}</h1>
              <h3 className={styles["record-value"]}><span className={styles["value"]}>{leaderboard.mostDistance.distance}</span>km passed!</h3>
            </div>
            <div className={styles["record"]}>
              <div className={styles["record-type-box"]}>
                <SpeedIcon sx={{ width: "32px", height: "32px", color: "#ff990a" }}/>
                <h2 className={styles["record-type"]}>Duration</h2>
              </div>
              <h1 className={styles["record-holder"]} onClick={() => router.push(`/explore/users/${leaderboard.mostDuration.id}`)}>{leaderboard.mostDuration.name}</h1>
              <h3 className={styles["record-value"]}><span className={styles["value"]}>{leaderboard.mostDuration.duration.hours}:{leaderboard.mostDuration.duration.minutes}:{leaderboard.mostDuration.duration.seconds}</span>s of exercise!</h3>
            </div>
          </div>
        )
  );
}
