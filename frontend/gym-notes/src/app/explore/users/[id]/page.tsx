'use client'

import Loading from "@/app/components/Loading/Loading";
import ProfilePage from "@/app/components/Users/Profile/ProfilePage";
import WorkoutManager from "@/app/components/Workouts/Manager/WorkoutManager";
import { fetchProfileInfo } from "@/app/requests/fetchs";
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

  useEffect(() => {
    async function loadProfileInfo() {
      try {
        const user = await fetchProfileInfo(id?.toString());
        console.log(user);
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

