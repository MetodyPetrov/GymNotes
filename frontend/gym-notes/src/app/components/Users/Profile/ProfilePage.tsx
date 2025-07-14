import { useRef, useState } from "react";
import styles from "./ProfilePage.module.css";
import { Button } from "@mui/material";
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { formatDuration } from "@/app/helper-functions/functions";

type ProfilePageProps = {
    profile: Profile;
    handleLogout?: () => void;
}

export default function ProfilePage({ profile, handleLogout } : ProfilePageProps) {
    const statisticsRef = useRef<HTMLDivElement>(null);
    const [ isMouseDown, setIsMouseDown ] = useState(false);
    const [ startX, setStartX ] = useState(0);
    const [ scrollLeft, setScrollLeft ] = useState(0);
    
    const [logoutHovered,setLogoutHovered] = useState(false);

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
                <h2 className={styles["username"]}>{profile?.name}</h2>
                {handleLogout ? <Button sx={{ 
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
                >log out</Button> : <></>}
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
                    <h5 className={styles["statistic-number"]}>{profile?.workouts}</h5>
                    <EmojiEventsIcon sx={{ height: '100px', width: '100px', color: '#ff990a' }}/>
                </div>
                <div className={styles["statistic"]}>
                    <h3 className={styles["statistic-title"]}>TOTAL SETS</h3>
                    <h5 className={styles["statistic-number"]}>{profile?.sets}</h5>
                    <EmojiEventsIcon sx={{ height: '100px', width: '100px', color: '#ff990a' }}/>
                </div>
                <div className={styles["statistic"]}>
                    <h3 className={styles["statistic-title"]}>TOTAL KG LIFTED</h3>
                    <h5 className={styles["statistic-number"]}>{profile?.volume}</h5>
                    <EmojiEventsIcon sx={{ height: '100px', width: '100px', color: '#ff990a' }}/>
                </div>
                <div className={styles["statistic"]}>
                    <h3 className={styles["statistic-title"]}>TOTAL DISTANCE</h3>
                    <h5 className={styles["statistic-number"]}>{profile?.distance}</h5>
                    <EmojiEventsIcon sx={{ height: '100px', width: '100px', color: '#ff990a' }}/>
                </div>
                <div className={styles["statistic"]}>
                    <h3 className={styles["statistic-title"]}>TOTAL DURATION</h3>
                    <h5 className={styles["statistic-number"]}>{formatDuration(profile?.duration)}</h5>
                    <EmojiEventsIcon sx={{ height: '100px', width: '100px', color: '#ff990a' }}/>
                </div>
            </div>
            
        </>
    )
}