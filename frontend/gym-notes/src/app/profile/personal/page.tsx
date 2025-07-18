'use client'

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchProfileInfo } from "@/app/requests/fetchs";
import Loading from "@/app/components/Loading/Loading";
import ProfilePage from "@/app/components/Users/Profile/ProfilePage";

export default function PersonalProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState<Profile>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadUser() {
            try {
                const profile = await fetchProfileInfo();
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