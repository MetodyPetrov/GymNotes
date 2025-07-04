'use client'

import { Button } from "@mui/material";
import styles from "./page.module.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthPage() {
    const router = useRouter();
    const [register, setRegister] = useState(false);

    useEffect(() => {
        if(localStorage.getItem('accessToken')) router.replace('/profile');
    }, []);

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const form = event.target as HTMLFormElement;
        const fd = new FormData(form);

        // api
        if(register) {
            alert('Account successfully registered!');
        }
        router.replace('/profile');
        localStorage.setItem('accessToken', '1');
    }

    function handleNonExistentAccount() {
        alert('Wrong credentials');
    }


    return (
        <form className={styles["page-container"]} onSubmit={handleSubmit}>
            <input className={styles["input-field"]} placeholder="Name" required name="user"></input>
            <input className={styles["input-field"]} placeholder="Password" required name="pass"></input>
            {register ? <input className={styles["input-field"]} placeholder="Confirm Password" required name="confirmPass"></input> : '' }
            <Button sx={{ width: 'fit-content' }} onClick={() => setRegister(!register)}>{register ? 'Log in' : 'Register'}</Button>
            <Button type="submit" sx={{ marginTop: '35px', backgroundColor: '#fb0', fontSize: '25px', height: '40px' }}>{register ? 'Register' : 'Log in'}</Button>
        </form>
    );
}