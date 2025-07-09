'use client'

import { Button } from "@mui/material";
import styles from "./page.module.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser, registerUser, tempLoginUser, tempRegisterUser } from "../requests/fetchs";
import Loading from "../components/Loading";

export default function AuthPage() {
    const router = useRouter();
    const [register, setRegister] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if(localStorage.getItem('accessToken')) router.push('/profile');
    }, []);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const form = event.target as HTMLFormElement;
        const fd = new FormData(form);

        const name = fd.get('name')?.toString() ?? '';
        const pass = fd.get('password')?.toString() ?? '';

        setLoading(true);

        // api
        if (register) {
            const confirmPassword = fd.get('confirmPass')?.toString() ?? '';
            try {
                await tempRegisterUser(name, pass, confirmPassword);
                router.push('/profile');  
            } catch (err) {
                alert('Registration failed: ' + (err as Error).message);
            }
        } else {
            try {
                await tempLoginUser(name, pass);
                router.push('/profile');  
            } catch (err) {
                alert('Login failed: ' + (err as Error).message);
            }
        }
        localStorage.setItem('accessToken', '1');
    }

    function handleNonExistentAccount() {
        alert('Wrong credentials');
    }


    return (
        <form className={styles["page-container"]} onSubmit={handleSubmit}>
            <input className={styles["input-field"]} placeholder="Name" required name="name"></input>
            <input className={styles["input-field"]} placeholder="Password" required name="password"></input>
            {register ? <input className={styles["input-field"]} placeholder="Confirm Password" required name="confirmPass"></input> : '' }
            <Button sx={{ width: 'fit-content' }} onClick={() => setRegister(!register)}>
                {register ? 'Log in' : 'Register'}
            </Button>
            <Button
                type="submit"
                sx={{ 
                    marginTop: '35px',
                    backgroundColor: '#fb0',
                    fontSize: '25px',
                    height: '40px',
                    display: 'flex',
                    justifyContent: 'center' 
                }}
            >
                {   loading ? <Loading>{register ? 'Register' : 'Log in'}</Loading> : (register ? 'Register' : 'Log in')    }
            </Button>
        </form>
    );
}