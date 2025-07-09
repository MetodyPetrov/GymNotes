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
    name: string;
    memberSince: string;

    workouts: number;
    sets: number;
    volume: Volume;
    duration: Duration;
}