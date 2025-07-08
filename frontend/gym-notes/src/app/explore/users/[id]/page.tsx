'use client'

import Loading from "@/app/components/Loading";
import ProfilePage from "@/app/components/Profile/ProfilePage";
import WorkoutsList from "@/app/components/WorkoutsList";
import { fetchPersonalWorkoutList, fetchProfileInfo, tempFetchPersonalWorkoutList, tempFetchProfileInfo } from "@/app/requests/fetchs";
import { WorkoutModel } from "@/app/types/Workout.types";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

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

  useEffect(() => {
    async function loadProfilePage() {
      try {
        const user = await tempFetchProfileInfo(Number(id));
        setProfile(user);
        const workoutsList = await tempFetchPersonalWorkoutList(Number(id));
        setWorkouts(workoutsList);
        setLoadingStatus(FetchStatus.COMPLETED);
      } catch (err) {
        console.error(err);
        setLoadingStatus(FetchStatus.ERRORED);
      }
    }

    loadProfilePage();
  }, []);
  
  return (
    loadingStatus === FetchStatus.LOADING ? <Loading>Loading</Loading> :
    ( loadingStatus === FetchStatus.ERRORED ? <h2>Something went wrong.</h2> :

      (
        profile && workouts ? <>
          <ProfilePage profile={profile} />
            <WorkoutsList workouts={workouts} personal={false} removeWorkout={() => {}}/>
          </> : <></>
      )
    )
  );
}

