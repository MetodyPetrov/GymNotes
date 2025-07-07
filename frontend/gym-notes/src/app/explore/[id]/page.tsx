'use client'

import Loading from "@/app/components/Loading";
import ProfilePage from "@/app/components/Profile/ProfilePage";
import WorkoutsList from "@/app/components/WorkoutsList";
import { fetchPersonalWorkoutList, fetchProfileInfo, tempFetchProfileInfo } from "@/app/requests/fetchs";
import { useState } from "react";

export default async function UserProfilePage({ params }: { params: { id: string } }) {
  const [loadingStatus, setLoadingStatus] = useState<string | boolean>('Loading Profile Info');
  const { id } = params;
  
  let profile;
  let workouts;

  try {
    profile = await tempFetchProfileInfo(Number(id));
    setLoadingStatus('Loading Profile Workouts');
    workouts = await fetchPersonalWorkoutList(Number(id));
  } catch (err) {
    alert(err);
    console.error(err);
    return <div>Something went wrong</div>
  } finally {
    setLoadingStatus(false);
  }

  return (
    loadingStatus ? <Loading>{loadingStatus}</Loading> :
    <>
        <ProfilePage profile={profile}/>
        <WorkoutsList workouts={workouts} personal={false} removeWorkout={() => {}}/>
    </>
  );
}

