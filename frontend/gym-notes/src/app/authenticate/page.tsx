'use client'

import { Button } from "@mui/material";
import styles from "./page.module.css";
import { useContext } from "react";
import { NavBarContext } from "../layout";

export default function AuthPage() {
    let { setPageTitle } = useContext(NavBarContext);

    function handleLogin(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const form = event.target as HTMLFormElement;
        const fd = new FormData(form);

        // api
    }

    function handleNonExistentAccount() {
        setPageTitle('Register')
    }


    return (
        <form className={styles["page-container"]} onSubmit={handleLogin}>
            <input className={styles["input-field"]} placeholder="Name" required name="user"></input>
            <input className={styles["input-field"]} placeholder="Password" required name="pass"></input>
            <Button type="submit" sx={{ marginTop: '35px', backgroundColor: '#fb0', fontSize: '25px', height: '40px' }}>Log in</Button>
        </form>
    );
}

function useOutletContext(): { changeNavBar: any; } {
    throw new Error("Function not implemented.");
}
