import dayjs from 'dayjs';

export const exampleUser = {
    name: 'Eddie Hall',
    memberSince: '03.07.2025',

    workouts: 2,
    sets: 20,
    volume: { tons: 1, kg: 400 },
    duration: { hours: '00', minutes: '00', seconds: '00' }
};

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
    exercises: 
    [
      { id: 123, name: 'Squat', tags: [ 'Legs' ], sets: [ { volume: 100, reps: 12, duration: null, distance: null }, { volume: 90, reps: 12, duration: null, distance: null }, { volume: 90, reps: 8, duration: null, distance: null } ] },
      { id: 323, name: 'Squat', tags: [ 'Legs' ], sets: [ { volume: 100, reps: 12, duration: null, distance: null }, { volume: 90, reps: 12, duration: null, distance: null }, { volume: 90, reps: 8, duration: null, distance: null } ] },
      { id: 588, name: 'Squat', tags: [ 'Legs' ], sets: [ { volume: 100, reps: 12, duration: null, distance: null }, { volume: 90, reps: 12, duration: null, distance: null }, { volume: 90, reps: 8, duration: null, distance: null } ] },
    ],
    comments: 
    [
      { owner: 'Tom Platz', comment: 'Had 50 more sets in you', dateCreated: dayjs('2025-07-03') },
      { owner: 'Jay Cutler', comment: 'bro trained till mild discomfort', dateCreated: dayjs('2025-07-04') }
    ],
    dateCreated: dayjs('2025-07-01') 
  },
  { 
    id: 545555,
    exercises: 
    [
      { id: 123, name: 'Squat', tags: [ 'Legs' ], sets: [ { volume: 100, reps: 12, duration: null, distance: null }, { volume: 90, reps: 12, duration: null, distance: null }, { volume: 90, reps: 8, duration: null, distance: null } ] },
      { id: 323, name: 'Squat', tags: [ 'Legs' ], sets: [ { volume: 100, reps: 12, duration: null, distance: null }, { volume: 90, reps: 12, duration: null, distance: null }, { volume: 90, reps: 8, duration: null, distance: null } ] },
      { id: 588, name: 'Squat', tags: [ 'Legs' ], sets: [ { volume: 100, reps: 12, duration: null, distance: null }, { volume: 90, reps: 12, duration: null, distance: null }, { volume: 90, reps: 8, duration: null, distance: null } ] },
    ],
    comments: 
    [
      { owner: 'Tom Platz', comment: 'Have you achieved failure?', dateCreated: dayjs('2025-07-01') },
      { owner: 'Jay Cutler', comment: 'bro prolly has chicken legs', dateCreated: dayjs('2025-06-30') }
    ],
    dateCreated: dayjs('2025-06-27') 
  }
]