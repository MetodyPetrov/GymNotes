'use client'

import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import { Button } from "@mui/material";
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { useRef, useState } from "react";

const user = {
    name: 'Eddie Hall',
    memberSince: '03.07.2025',

    workouts: 2,
    sets: 20,
    volume: { tons: 1, kg: 400 },
    duration: { hours: '00', minutes: '00', seconds: '00' }
};

export default function ProfilePage() {
    const router = useRouter();

    const statisticsRef = useRef<HTMLDivElement>(null);
    const [ isMouseDown, setIsMouseDown ] = useState(false);
    const [ startX, setStartX ] = useState(0);
    const [ scrollLeft, setScrollLeft ] = useState(0);
    
    const [logoutHovered,setLogoutHovered] = useState(false);

    if(!localStorage.getItem('accessToken')) {
        router.replace('/authenticate');
    } else {
        //api fetch profile info thru token
    }

    function handleLogout() {
        localStorage.clear();
        router.replace('/authenticate');
    }

    function handleMouseDown(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        if (!statisticsRef || !statisticsRef.current) return;
        setIsMouseDown(true);
        setStartX(event.pageX - statisticsRef.current.offsetLeft);
        setScrollLeft(statisticsRef.current.scrollLeft);
    }
    function handleMouseLeave() {
        setIsMouseDown(false);
    }
    function handleMouseUp() {
        setIsMouseDown(false);
    }
    function handleMouseMove(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        if (!isMouseDown || !statisticsRef || !statisticsRef.current) return;
        event.preventDefault();
        const x = event.pageX - statisticsRef.current.offsetLeft;
        const walk = (x - startX) * 1; // speed
        statisticsRef.current.scrollLeft = scrollLeft - walk;
    }


    return (
        <>
            <div className={styles["username-container"]}>
                <h2 className={styles["username"]}>{user.name}</h2>
                <Button sx={{ 
                    position: 'absolute',
                    right: '0',
                    backgroundColor: '#ff000061',
                    color: 'white',
                    transition: '0.3s',
                    fontSize: logoutHovered ? '1rem' : '0.875rem'
                }}
                    onMouseEnter={() => setLogoutHovered(true)}
                    onMouseLeave={() => setLogoutHovered(false)}
                    onClick={handleLogout}
                >log out</Button>
            </div>
            <div 
                className={styles["statistics-container"]}
                ref={statisticsRef}
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseLeave}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
                style={{ cursor: isMouseDown ? 'grabbing' : 'grab' }}
            >
                <div className={styles["statistic"]}>
                    <h3 className={styles["statistic-title"]}>WORKOUTS</h3>
                    <h5 className={styles["statistic-number"]}>{user.workouts}</h5>
                    <EmojiEventsIcon sx={{ height: '100px', width: '100px', color: '#ff990a' }}/>
                </div>
                <div className={styles["statistic"]}>
                    <h3 className={styles["statistic-title"]}>TOTAL SETS</h3>
                    <h5 className={styles["statistic-number"]}>{user.sets}</h5>
                    <EmojiEventsIcon sx={{ height: '100px', width: '100px', color: '#ff990a' }}/>
                </div>
                <div className={styles["statistic"]}>
                    <h3 className={styles["statistic-title"]}>TOTAL KG LIFTED</h3>
                    <h5 className={styles["statistic-number"]}>{user.volume.tons + '' + user.volume.kg}</h5>
                    <EmojiEventsIcon sx={{ height: '100px', width: '100px', color: '#ff990a' }}/>
                </div>
                <div className={styles["statistic"]}>
                    <h3 className={styles["statistic-title"]}>TOTAL DURATION</h3>
                    <h5 className={styles["statistic-number"]}>{user.duration.hours + ':' + user.duration.minutes + ':' + user.duration.seconds}</h5>
                    <EmojiEventsIcon sx={{ height: '100px', width: '100px', color: '#ff990a' }}/>
                </div>
            </div>
            
        </>
    );
}