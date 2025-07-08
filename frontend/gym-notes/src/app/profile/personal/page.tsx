'use client'

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchProfileInfo, tempFetchProfileInfo } from "../../requests/fetchs";
import Loading from "../../components/Loading";
import ProfilePage from "../../components/Profile/ProfilePage";

export default function PersonalProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState<Profile>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadUser() {
            try {
                const profile = await tempFetchProfileInfo();
                setUser(profile);
            } catch (err) {
                alert(err);
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        loadUser();
    }, []);

    function handleLogout() {
        localStorage.clear();
        router.replace('/authenticate');
    }

    return loading ? <Loading>Fetching Profile Data</Loading> : (
        user && <ProfilePage profile={user} handleLogout={handleLogout}/>
    );
}