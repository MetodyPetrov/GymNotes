'use client'

import Loading from "@/app/components/Loading/Loading";
import ProfilePage from "@/app/components/Users/Profile/ProfilePage";
import WorkoutsList from "@/app/components/Workouts/List/WorkoutsList";
import WorkoutManager from "@/app/components/Workouts/Manager/WorkoutManager";
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

  useEffect(() => {
    async function loadProfileInfo() {
      try {
        const user = await tempFetchProfileInfo(id?.toString());
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
      <>
        { profile && <ProfilePage profile={profile} /> }
        <WorkoutManager userId={id?.toString()}/>
      </>
    )
  );
}

