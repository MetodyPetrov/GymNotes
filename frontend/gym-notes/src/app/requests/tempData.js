import dayjs from 'dayjs';

export const exampleUser = {
    id: 0,
    name: 'Eddie Hall',
    memberSince: '03.07.2025',

    workouts: 2,
    sets: 20,
    volume: { tons: 1, kg: 400 },
    distance: 0,
    duration: { hours: '00', minutes: '00', seconds: '00' }
};

export const profilesList = [
  {
    id: 1,
    name: 'Jay Cutler',
    memberSince: '28.06.2025',

    workouts: 20,
    sets: 200,
    volume: { tons: 10, kg: 100 },
    distance: 0,
    duration: { hours: '00', minutes: '00', seconds: '00' }
  },
  {
    id: 2,
    name: 'Tom Platz',
    memberSince: '15.06.2025',

    workouts: 10,
    sets: 500,
    volume: { tons: 25, kg: 500 },
    distance: 0,
    duration: { hours: '00', minutes: '00', seconds: '00' }
  },
  {
    id: 3,
    name: 'Chris Bumstead',
    memberSince: '03.07.2025',

    workouts: 3,
    sets: 33,
    volume: { tons: 1, kg: 200 },
    distance: 30,
    duration: { hours: '01', minutes: '30', seconds: '00' }
  },
  {
    id: 4,
    name: 'Sam Sulek',
    memberSince: '05.06.2025',

    workouts: 28,
    sets: 315,
    volume: { tons: 15, kg: 750 },
    distance: 420,
    duration: { hours: '14', minutes: '00', seconds: '00' }
  },
  {
    id: 5,
    name: 'Ronnie Coleman',
    memberSince: '01.06.2025',

    workouts: 15,
    sets: 150,
    volume: { tons: 4, kg: 500 },
    distance: 60,
    duration: { hours: '3', minutes: '45', seconds: '00' }
  },
  {
    id: 6,
    name: 'Kevin Levrone',
    memberSince: '13.06.2025',

    workouts: 44,
    sets: 440,
    volume: { tons: 17, kg: 600 },
    distance: 220,
    duration: { hours: '11', minutes: '00', seconds: '00' }
  },
  {
    id: 7,
    name: 'Mike Israetel',
    memberSince: '05.06.2025',

    workouts: 30,
    sets: 600,
    volume: { tons: 0, kg: 1 },
    distance: 0,
    duration: { hours: '00', minutes: '00', seconds: '00' }
  },
  {
    id: 8,
    name: 'Greg Doucette',
    memberSince: '22.06.2025',

    workouts: 15,
    sets: 150,
    volume: { tons: 7, kg: 500 },
    distance: 220,
    duration: { hours: '07', minutes: '30', seconds: '00' }
  },
  {
    id: 9,
    name: 'Noel Deyzel',
    memberSince: '27.06.2025',

    workouts: 8,
    sets: 80,
    volume: { tons: 4, kg: 500 },
    distance: 135,
    duration: { hours: '04', minutes: '30', seconds: '00' }
  },
  {
    id: 10,
    name: 'Togi',
    memberSince: '02.06.2025',

    workouts: 1,
    sets: 2,
    volume: { tons: 0, kg: 150 },
    distance: 0,
    duration: { hours: '00', minutes: '00', seconds: '00' }
  },
  {
    id: 11,
    name: 'Bradley Martin',
    memberSince: '06.07.2025',

    workouts: 1,
    sets: 9,
    volume: { tons: 0, kg: 500 },
    distance: 0,
    duration: { hours: '00', minutes: '00', seconds: '00' }
  },
  {
    id: 12,
    name: 'Arnold Schwarzenegger',
    memberSince: '07.07.2025',

    workouts: 0,
    sets: 0,
    volume: { tons: 0, kg: 0 },
    distance: 0,
    duration: { hours: '00', minutes: '00', seconds: '00' }
  },
];

export const exercisesList = [ 
  { name: 'Squat', tags: ['Legs'], reps: true, volume: true, distance: false, duration: false },
  { name: 'Benchpress', tags: ['Chest', 'Arms'], reps: true, volume: true, distance: false, duration: false },
  { name: 'Deadlift', tags: ['Legs', 'Chest', 'Back', 'Arms'], reps: true, volume: true, distance: false, duration: false },
  { name: 'Pull Ups', tags: ['Back', 'Arms'], reps: true, volume: true, distance: false, duration: false },
  { name: 'Dips', tags: ['Chest', 'Arms'], reps: true, volume: true, distance: false, duration: false },
  { name: 'Chest Flys', tags: ['Chest'], reps: true, volume: true, distance: false, duration: false },
  { name: 'Incline Benchpress', tags: ['Chest', 'Arms'], reps: true, volume: true, distance: false, duration: false },
  { name: 'Lat Pulldowns', tags: ['Back', 'Arms'], reps: true, volume: true, distance: false, duration: false },
  { name: 'Rear Delt Flys', tags: ['Back', 'Arms'], reps: true, volume: true, distance: false, duration: false },
  { name: 'Plank', tags: ['Back', 'Abs'], reps: false, volume: true, distance: false, duration: true },
  { name: 'Treadmill', tags: ['Cardio'], reps: false, volume: true, distance: true, duration: true },
  { name: 'Static Bike', tags: ['Cardio'], reps: false, volume: false, distance: true, duration: true }
];

export const workoutsList = [
  { 
    id: 32132,
    likes: 5,
    dislikes: 2,
    hasLiked: false,
    hasDisliked: false,
    exercises: 
    [
      { id: 123, name: 'Bench', tags: [ 'Legs' ], sets: [ { id: 0, volume: 100, reps: 12, duration: null, distance: null }, { id: 6, volume: 90, reps: 12, duration: null, distance: null }, { id: 12, volume: 90, reps: 8, duration: null, distance: null } ] },
      { id: 323, name: 'Squat', tags: [ 'Legs' ], sets: [ { id: 1, volume: 100, reps: 12, duration: null, distance: null }, { id: 7, volume: 90, reps: 12, duration: null, distance: null }, { id: 13, volume: 90, reps: 8, duration: null, distance: null } ] },
      { id: 588, name: 'Pull ups', tags: [ 'Legs' ], sets: [ { id: 2, volume: 100, reps: 12, duration: null, distance: null }, { id: 8, volume: 90, reps: 12, duration: null, distance: null }, { id: 14, volume: 90, reps: 8, duration: null, distance: null } ] },
    ],
    comments: 
    [
      { id: 1, owner: 'Tom Platz', ownerId: 2, comment: 'Had 50 more sets in you', dateCreated: dayjs('2025-07-03') },
      { id: 2, owner: 'Jay Cutler', ownerId: 1,comment: 'bro trained till mild discomfort', dateCreated: dayjs('2025-07-04') }
    ],
    dateCreated: dayjs('2025-07-01') 
  },
  { 
    id: 545555,
    likes: 1,
    dislikes: 0,
    hasLiked: true,
    hasDisliked: false,
    exercises: 
    [
      { id: 123, name: 'Squat', tags: [ 'Legs' ], sets: [ { id: 3, volume: 100, reps: 12, duration: null, distance: null }, { id: 9, volume: 90, reps: 12, duration: null, distance: null }, { id: 15, volume: 90, reps: 8, duration: null, distance: null } ] },
      { id: 323, name: 'Chest Flys', tags: [ 'Legs' ], sets: [ { id: 4, volume: 100, reps: 12, duration: null, distance: null }, { id: 10, volume: 90, reps: 12, duration: null, distance: null }, { id: 16, volume: 90, reps: 8, duration: null, distance: null } ] },
      { id: 588, name: 'Squat', tags: [ 'Legs' ], sets: [ { id: 5, volume: 100, reps: 12, duration: null, distance: null }, { id: 11, volume: 90, reps: 12, duration: null, distance: null }, { id: 17, volume: 90, reps: 8, duration: null, distance: null } ] },
    ],
    comments: 
    [
      { id: 3, owner: 'Tom Platz', ownerId: 2, comment: 'Have you achieved failure?', dateCreated: dayjs('2025-07-01') },
      { id: 4, owner: 'Jay Cutler', ownerId: 1, comment: 'bro prolly has chicken legs', dateCreated: dayjs('2025-06-30') }
    ],
    dateCreated: dayjs('2025-06-27') 
  }
]

export const leaderboard = {
  mostWorkouts: {
    id: 4,
    name: 'Sam Sulek',
    workouts: 28
  },
  mostSets: {
    id: 2,
    name: 'Tom Platz',
    sets: 500
  },
  mostVolume: {
    id: 2,
    name: 'Tom Platz',
    volume: { tons: 25, kg: 500 }
  },
  mostDistance: {
    id: 4,
    name: 'Sam Sulek',
    distance: 420
  },
  mostDuration: { 
    id: 4,
    name: 'Sam Sulek',
    duration: { hours: '14', minutes: '00', seconds: '00' }
  }
}