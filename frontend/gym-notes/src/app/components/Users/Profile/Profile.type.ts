type Duration = {
    hours: string;
    minutes: string;
    seconds: string;
}

type Profile = {
    id: number;
    name: string;
    memberSince: string;

    workouts: number;
    sets: number;
    volume: number;
    distance: number;
    duration: Duration;
}