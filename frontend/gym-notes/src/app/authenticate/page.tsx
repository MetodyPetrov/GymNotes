'use client'

import { Button } from "@mui/material";
import styles from "./page.module.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser, registerUser, tempLoginUser, tempRegisterUser } from "../requests/fetchs";
import Loading from "../components/Loading/Loading";

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

        if (register) {
            const confirmPassword = fd.get('confirmPass')?.toString() ?? '';
            try {
                await registerUser(name, pass, confirmPassword);
                router.push('/profile');  
            } catch (err) {
                alert('Registration failed: ' + (err as Error).message);
            } 
        } else {
            try {
                await loginUser(name, pass);
                router.push('/profile/personal');
            } catch (err) {
                alert('Login failed: ' + (err as Error).message);
            }
        }
        await new Promise(res => setTimeout(res, 2000));
        setLoading(false);
        // localStorage.setItem('username', 'Eddie Hall');
    }

    return (
        <form className={styles["page-container"]} onSubmit={handleSubmit}>
            <input className={styles["input-field"]} placeholder="Name" required name="name"></input>
            <input type="password" className={styles["input-field"]} placeholder="Password" required name="password"></input>
            {register ? <input type="password" className={styles["input-field"]} placeholder="Confirm Password" required name="confirmPass"></input> : '' }
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