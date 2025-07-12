'use client'

import Loading from "@/app/components/Loading/Loading";
import ProfilePage from "@/app/components/Users/Profile/ProfilePage";
import WorkoutsList from "@/app/components/Workouts/List/WorkoutsList";
import { fetchPersonalWorkoutList, fetchProfileInfo, tempFetchPersonalWorkoutList, tempFetchProfileInfo } from "@/app/requests/fetchs";
import { WorkoutModel } from "@/app/types/Workout.types";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

enum FetchStatus {
  LOADING, 
  COMPLETED,
  ERRORED
}

export default function UserProfilePage() {
  const [loadingStatus, setLoadingStatus] = useState<FetchStatus>(FetchStatus.LOADING);
  const { id } = useParams();
  
  const [profile, setProfile] = useState<Profile>();
  const [workouts, setWorkouts] = useState<WorkoutModel[]>();

  const [offset, setOffset] = useState(0);
  const limit = 3;

  const hasLoadedRef = useRef(false);
  async function loadWorkouts() {
    try {
      const data = await tempFetchPersonalWorkoutList(limit, offset, Number(id));
      setWorkouts(prev => [...prev || [], ...data]);
      setOffset(prev => prev + limit);
    } catch (err) {
      alert('Failed to fetch workouts');
      console.error('Failed to fetch workouts', err);
      setLoadingStatus(FetchStatus.ERRORED);
    }
  }

  useEffect(() => {
    if (!hasLoadedRef.current) {
      hasLoadedRef.current = true;
      loadWorkouts();
    }
  }, []);

  useEffect(() => {
    async function loadProfileInfo() {
      try {
        const user = await tempFetchProfileInfo(Number(id));
        setProfile(user);
        setLoadingStatus(FetchStatus.COMPLETED);
      } catch (err) {
        console.error(err);
        setLoadingStatus(FetchStatus.ERRORED);
      }
    }

    loadProfileInfo();
  }, []);


  
  return (
    loadingStatus === FetchStatus.LOADING ? <Loading>Loading</Loading> :
    ( loadingStatus === FetchStatus.ERRORED ? <h2>Something went wrong.</h2> :

      (
        profile && workouts ? <>
          <ProfilePage profile={profile} />
            <WorkoutsList workouts={workouts} personal={false} removeWorkout={() => {}} fetchMoreWorkouts={loadWorkouts}/>
          </> : <></>
      )
    )
  );
}

