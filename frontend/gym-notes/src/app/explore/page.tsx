'use client'

import { useRouter } from "next/navigation";

export default function Explore() {
    const router = useRouter();
    router.replace('/explore/users');

    return (
        <></>
    );
}