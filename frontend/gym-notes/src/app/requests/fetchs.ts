import { CommentModel, ExerciseModel, ExerciseTemplate, WorkoutModel } from "../types/Workout.types";
import { exampleUser, exercisesList, workoutsList } from "./tempData.js";

export async function registerUser( name: string, password: string, confirmPass: string ) {
  const res = await fetch('http://localhost:8080/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: name, password: password, confirmPassword: confirmPass, email: 'foncho@gmail.com' })
  });

  if (!res.ok) {
    throw new Error('Registration failed');
  }

  const { accessToken } = await res.json() as { accessToken: string };
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('username', name);
} // put function await in authenticate/page.tsx

export async function loginUser( name: string, password: string ) {
  const res = await fetch('http://localhost:8080/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: name, password })
  });
  if (!res.ok) {
    throw new Error('Login failed');
  }
  
  const { accessToken } = await res.json() as { accessToken: string };
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('username', name);
}

export async function fetchProfileInfo(user?: string) {
  const res = await fetch('http://localhost:8080/profile/info', {
    method: 'GET',
    headers: { 
      'Content-Type': 'application/json',
      'X-Authorization': localStorage.getItem('accessToken') ?? ''
    },
    body: JSON.stringify({ username: user || undefined })
  });
  if (!res.ok) {
    throw new Error('Login failed');
  }
  
  const profile = await res.json();

  return profile;
}

export async function fetchExercisesList() {
  const res = await fetch('http://localhost:8080/exercises/templates', {
    method: 'GET',
    headers: { 
      'Content-Type': 'application/json',
      'X-Authorization': localStorage.getItem('accessToken') ?? ''
    }
  });
  if (!res.ok) {
    throw new Error('Fetching template exercises failed');
  }

  const exercises: ExerciseTemplate[] = await res.json();

  return exercises;
}

export async function fetchWorkoutExercises(workoutId: number) {
  const res = await fetch('http://localhost:8080/workout/exercises', {
    method: 'GET',
    headers: { 
      'Content-Type': 'application/json',
      'X-Authorization': localStorage.getItem('accessToken') ?? ''
    },
    body: JSON.stringify({ id: workoutId })
  });
  if (!res.ok) {
    throw new Error('Fetching workout-' + workoutId + ' exercises failed');
  }

  const exercises: ExerciseModel[] = await res.json();

  return exercises;
}

export async function fetchSubmitNewExercise(exercise: ExerciseTemplate) {
  const res = await fetch('http://localhost:8080/exercise/templates/new', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'X-Authorization': localStorage.getItem('accessToken') ?? ''
    },
    body: JSON.stringify({ name: exercise.name, tags: exercise.tags, reps: exercise.reps, volume: exercise.volume, distance: exercise.distance, duration: exercise.duration })
  });
  if (!res.ok) {
    throw new Error('Creating exercise failed');
  }
}

export async function fetchPersonalWorkoutList(user?: string) {
  const res = await fetch('http://localhost:8080/workout/list', {
    method: 'GET',
    headers: { 
      'Content-Type': 'application/json',
      'X-Authorization': localStorage.getItem('accessToken') ?? ''
    },
    body: JSON.stringify({ user: user || undefined })
  });
  if (!res.ok) {
    throw new Error('Personal workout list fetching failed');
  }

  const workouts: WorkoutModel[] = await res.json();

  return workouts;
}

export async function fetchUpdateWorkout(workout: ExerciseModel[], workoutId: number) {
  const res = await fetch('http://localhost:8080/workout/update', {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
      'X-Authorization': localStorage.getItem('accessToken') ?? ''
    },
    body: JSON.stringify({ id: workoutId, workout: workout })
  });
  if (!res.ok) {
    throw new Error('Updating workout exercises failed');
  }
}

export async function fetchSubmitNewWorkout(workout: ExerciseModel[]) {
  const res = await fetch('http://localhost:8080/workout/new', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'X-Authorization': localStorage.getItem('accessToken') ?? ''
    },
    body: JSON.stringify({ workout: workout })
  });
  if (!res.ok) {
    throw new Error('Creating workout failed');
  }
}

export async function fetchDeleteWorkout(workoutId: number) {
  const res = await fetch('http://localhost:8080/workout/delete', {
    method: 'DELETE',
    headers: { 
      'Content-Type': 'application/json',
      'X-Authorization': localStorage.getItem('accessToken') ?? ''
    },
    body: JSON.stringify({ id: workoutId })
  });
  if (!res.ok) {
    throw new Error('Deleting workout failed');
  }
}

export async function fetchComments(workoutId: number) {
  const res = await fetch('http://localhost:8080/workout/comments', {
    method: 'GET',
    headers: { 
      'Content-Type': 'application/json',
      'X-Authorization': localStorage.getItem('accessToken') ?? ''
    },
    body: JSON.stringify({ id: workoutId })
  });
  if (!res.ok) {
    throw new Error('Fetching workout comments failed');
  }

  const comments: CommentModel[] = await res.json();

  return comments;
}

export async function fetchNewComment(comment: string) {
  const res = await fetch('http://localhost:8080/workout/comments/new', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'X-Authorization': localStorage.getItem('accessToken') ?? ''
    },
    body: JSON.stringify({ comment: comment })
  });
  if (!res.ok) {
    throw new Error('Adding new comment failed');
  }
}

export async function fetchEditComment(newComment: string) {
  const res = await fetch('http://localhost:8080/workout/comments/edit', {
    method: 'PATCH',
    headers: { 
      'Content-Type': 'application/json',
      'X-Authorization': localStorage.getItem('accessToken') ?? ''
    },
    body: JSON.stringify({ comment: newComment })
  });
  if (!res.ok) {
    throw new Error('Editing comment failed');
  }
}

export async function tempRegisterUser( name: string, password: string, confirmPass: string ) {
  await new Promise((resolve) => setTimeout(resolve, 5000));
  localStorage.setItem('accessToken', '1');
}

export async function tempLoginUser( name: string, password: string ) {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  localStorage.setItem('accessToken', '1');
}

export async function tempFetchProfileInfo(user?: string) {
  await new Promise(res => setTimeout(res, 500));
  return exampleUser;
}

export async function tempFetchExercisesList() {
  await new Promise(res => setTimeout(res, 2000));
  return exercisesList;
}

export async function tempFetchPersonalWorkoutList() {
  await new Promise(res => setTimeout(res, 0));
  return workoutsList;
}

export async function tempFetchUpdateWorkout(workout: ExerciseModel[], workoutId: number) {
  
}

export async function tempFetchSubmitNewWorkout(workout: ExerciseModel[]) {
  
}

export async function tempFetchDeleteWorkout(workoutId: number) {

}

export async function tempFetchSubmitNewExercise(exercise: ExerciseTemplate) {

}

export async function tempFetchComments(workoutId: number) {
  const comments: CommentModel[] = [];
  for(let i = 0; i < workoutsList.length; i++) {
    if(workoutsList[i].id === workoutId) comments.push(...workoutsList[i].comments);
  }
  await new Promise(res => setTimeout(res, 2000));

  return comments;
}

export async function tempFetchNewComment(comment: string) {
  await new Promise((resolve) => setTimeout(resolve, 2000));
}

export async function tempFetchEditComment(newComment: string) {
  await new Promise((resolve) => setTimeout(resolve, 2000));
}