import dayjs from 'dayjs';

export const exampleUser = {
    id: '0',
    name: 'Eddie Hall',
    memberSince: '03.07.2025',

    workouts: 2,
    sets: 20,
    volume: 1400,
    distance: 0,
    duration: 0
};

export const profilesList = [
  {
    id: '1',
    name: 'Jay Cutler',
    memberSince: '28.06.2025',

    workouts: 20,
    sets: 200,
    volume: 10100,
    distance: 0,
    duration: 0
  },
  {
    id: '2',
    name: 'Tom Platz',
    memberSince: '15.06.2025',

    workouts: 10,
    sets: 500,
    volume: 25500,
    distance: 0,
    duration: 0
  },
  {
    id: '3',
    name: 'Chris Bumstead',
    memberSince: '03.07.2025',

    workouts: 3,
    sets: 33,
    volume: 1200,
    distance: 30,
    duration: 5400
  },
  {
    id: '4',
    name: 'Sam Sulek',
    memberSince: '05.06.2025',

    workouts: 28,
    sets: 315,
    volume: 15750,
    distance: 420,
    duration: 50400
  },
  {
    id: '5',
    name: 'Ronnie Coleman',
    memberSince: '01.06.2025',

    workouts: 15,
    sets: 150,
    volume: 4500,
    distance: 60,
    duration: 13500
  },
  {
    id: '6',
    name: 'Kevin Levrone',
    memberSince: '13.06.2025',

    workouts: 44,
    sets: 440,
    volume: 17600,
    distance: 220,
    duration: 39600
  },
  {
    id: '7',
    name: 'Mike Israetel',
    memberSince: '05.06.2025',

    workouts: 30,
    sets: 600,
    volume: 1,
    distance: 0,
    duration: 0
  },
  {
    id: '8',
    name: 'Greg Doucette',
    memberSince: '22.06.2025',

    workouts: 15,
    sets: 150,
    volume: 7500,
    distance: 220,
    duration: 25200
  },
  {
    id: '9',
    name: 'Noel Deyzel',
    memberSince: '27.06.2025',

    workouts: 8,
    sets: 80,
    volume: 4500,
    distance: 135,
    duration: 16200
  },
  {
    id: '10',
    name: 'Togi',
    memberSince: '02.06.2025',

    workouts: 1,
    sets: 2,
    volume: 150,
    distance: 0,
    duration: 0
  },
  {
    id: '11',
    name: 'Bradley Martin',
    memberSince: '06.07.2025',

    workouts: 1,
    sets: 9,
    volume: 500,
    distance: 0,
    duration: 0
  },
  {
    id: '12',
    name: 'Arnold Schwarzenegger',
    memberSince: '07.07.2025',

    workouts: 0,
    sets: 0,
    volume: 0,
    distance: 0,
    duration: 0
  },
];

export const exercisesList = [ 
  { id: 'ex-0', name: 'Squat', tags: ['Legs'], reps: true, volume: true, distance: false, duration: false },
  { id: 'ex-1', name: 'Lunges', tags: ['Legs'], reps: true, volume: true, distance: false, duration: false },
  { id: 'ex-2', name: 'Leg Press', tags: ['Legs'], reps: true, volume: true, distance: false, duration: false },
  { id: 'ex-3', name: 'Calf Raises', tags: ['Legs'], reps: true, volume: true, distance: false, duration: false },

  { id: 'ex-4', name: 'Bench Press', tags: ['Chest', 'Arms'], reps: true, volume: true, distance: false, duration: false },
  { id: 'ex-5', name: 'Incline Bench Press', tags: ['Chest', 'Arms'], reps: true, volume: true, distance: false, duration: false },
  { id: 'ex-6', name: 'Chest Flys', tags: ['Chest', 'Arms'], reps: true, volume: true, distance: false, duration: false },
  { id: 'ex-7', name: 'Dips', tags: ['Chest', 'Arms'], reps: true, volume: true, distance: false, duration: false },

  { id: 'ex-8', name: 'Deadlift', tags: ['Legs', 'Back', 'Arms'], reps: true, volume: true, distance: false, duration: false },
  { id: 'ex-9', name: 'Pull Ups', tags: ['Back', 'Arms'], reps: true, volume: true, distance: false, duration: false },
  { id: 'ex-10', name: 'Lat Pulldowns', tags: ['Back', 'Arms'], reps: true, volume: true, distance: false, duration: false },
  { id: 'ex-11', name: 'Barbell Row', tags: ['Back', 'Arms'], reps: true, volume: true, distance: false, duration: false },

  { id: 'ex-12', name: 'Bicep Curls', tags: ['Arms'], reps: true, volume: true, distance: false, duration: false },
  { id: 'ex-13', name: 'Tricep Extensions', tags: ['Arms'], reps: true, volume: true, distance: false, duration: false },
  { id: 'ex-14', name: 'Shoulder Press', tags: ['Arms'], reps: true, volume: true, distance: false, duration: false },

  { id: 'ex-15', name: 'Plank', tags: ['Abs', 'Back'], reps: false, volume: true, distance: false, duration: true },
  { id: 'ex-16', name: 'Russian Twists', tags: ['Abs'], reps: true, volume: true, distance: false, duration: false },
  { id: 'ex-17', name: 'Hanging Leg Raises', tags: ['Abs'], reps: true, volume: true, distance: false, duration: false },
  { id: 'ex-18', name: 'Sit Ups', tags: ['Abs'], reps: true, volume: true, distance: false, duration: false },

  { id: 'ex-19', name: 'Treadmill', tags: ['Cardio', 'Legs'], reps: false, volume: true, distance: true, duration: true },
  { id: 'ex-20', name: 'Static Bike', tags: ['Cardio', 'Legs'], reps: false, volume: false, distance: true, duration: true },
  { id: 'ex-21', name: 'Rowing Machine', tags: ['Cardio', 'Back', 'Arms'], reps: false, volume: true, distance: true, duration: true },
  { id: 'ex-22', name: 'Elliptical', tags: ['Cardio', 'Legs'], reps: false, volume: false, distance: true, duration: true },
  { id: 'ex-23', name: 'Jump Rope', tags: ['Cardio', 'Arms'], reps: false, volume: false, distance: false, duration: true },
  { id: 'ex-24', name: 'Burpees', tags: ['Cardio', 'Legs', 'Arms'], reps: true, volume: true, distance: false, duration: true },
  { id: 'ex-25', name: 'Mountain Climbers', tags: ['Cardio', 'Abs'], reps: true, volume: true, distance: false, duration: true }
];


export const workoutsList = [
  {
    id: '32132',
    likes: 5,
    dislikes: 2,
    hasLiked: false,
    hasDisliked: false,
    exercises: 
    [
      { index: 0, id: 'ex-4', name: 'Bench Press', tags: [ 'Chest', 'Arms' ], sets: [ { id: '0', volume: 100, reps: 12, duration: null, distance: null }, { id: '6', volume: 90, reps: 12, duration: null, distance: null }, { id: '12', volume: 90, reps: 8, duration: null, distance: null } ] },
      { index: 1, id: 'ex-0', name: 'Squat', tags: [ 'Legs' ], sets: [ { id: '1', volume: 100, reps: 12, duration: null, distance: null }, { id: '7', volume: 90, reps: 12, duration: null, distance: null }, { id: '13', volume: 90, reps: 8, duration: null, distance: null } ] },
      { index: 2, id: 'ex-9', name: 'Pull Ups', tags: [ 'Back', 'Arms' ], sets: [ { id: '2', volume: 100, reps: 12, duration: null, distance: null }, { id: '8', volume: 90, reps: 12, duration: null, distance: null }, { id: '14', volume: 90, reps: 8, duration: null, distance: null } ] },
    ],
    comments: 
    [
      { id: '1', owner: 'Tom Platz', ownerId: '2', comment: 'Had 50 more sets in you', dateCreated: dayjs('2025-07-03') },
      { id: '2', owner: 'Jay Cutler', ownerId: '1',comment: 'bro trained till mild discomfort', dateCreated: dayjs('2025-07-04') }
    ],
    dateCreated: dayjs('2025-07-01') 
  }
]

export const leaderboard = {
  mostWorkouts: {
    id: '4',
    name: 'Sam Sulek',
    recordValue: 28
  },
  mostSets: {
    id: '2',
    name: 'Tom Platz',
    recordValue: 500
  },
  mostVolume: {
    id: '2',
    name: 'Tom Platz',
    recordValue: 25500
  },
  mostDistance: {
    id: '4',
    name: 'Sam Sulek',
    recordValue: 420
  },
  mostDuration: { 
    id: '4',
    name: 'Sam Sulek',
    recordValue: 50400
  }
}