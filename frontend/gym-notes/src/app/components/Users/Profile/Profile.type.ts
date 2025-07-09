type Volume = {
    tons: number;
    kg: number;
}

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
    volume: Volume;
    distance: number;
    duration: Duration;
}