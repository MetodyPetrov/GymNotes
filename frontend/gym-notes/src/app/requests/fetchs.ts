import { profile } from "console";
import { CommentModel, ExerciseModel, ExerciseTemplate, WorkoutModel } from "../types/Workout.types";
import { exampleUser, exercisesList, profilesList, workoutsList } from "./tempData.js";

export async function registerUser( name: string, password: string, confirmPass: string ) {
  const res = await fetch('http://localhost:8080/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: name, password: password, confirmPassword: confirmPass, email: 'foncho@gmail.com' })
  });

  const { messages, errorMessages } = await res.json();

  if (!res.ok) {
    throw new Error(errorMessages);
  } 

  alert(messages);
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
  
  const { token } = await res.json();
  document.cookie = `accessToken=${token}; path=/; secure; samesite=strict`;
  localStorage.setItem('accessToken', token);
  localStorage.setItem('username', name);
}

export async function fetchProfileInfo(id?: number) {
  const res = await fetch('http://localhost:8080/profiles/user/info', {
    method: 'GET',
    headers: { 
      'Content-Type': 'application/json',
      'X-Authorization': localStorage.getItem('accessToken') ?? ''
    },
    body: JSON.stringify({ id: id || undefined })
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

export async function fetchPersonalWorkoutList(id?: number) {
  const res = await fetch('http://localhost:8080/workout/list', {
    method: 'GET',
    headers: { 
      'Content-Type': 'application/json',
      'X-Authorization': localStorage.getItem('accessToken') ?? ''
    },
    body: JSON.stringify({ id: id || undefined })
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

export async function fetchNewComment(comment: string, workoutId: number) {
  const res = await fetch('http://localhost:8080/workout/comments/new', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'X-Authorization': localStorage.getItem('accessToken') ?? ''
    },
    body: JSON.stringify({ id: workoutId, comment: comment })
  });
  if (!res.ok) {
    throw new Error('Adding new comment failed');
  }

  const { id } = await res.json();
  return id;
}

export async function fetchEditComment(newComment: string, workoutId: number, commentId: number) {
  const res = await fetch('http://localhost:8080/workout/comments/edit', {
    method: 'PATCH',
    headers: { 
      'Content-Type': 'application/json',
      'X-Authorization': localStorage.getItem('accessToken') ?? ''
    },
    body: JSON.stringify({ commentId: commentId, workoutId: workoutId, comment: newComment })
  });
  if (!res.ok) {
    throw new Error('Editing comment failed');
  }
}

export async function fetchAddLike(workoutId: number) {
  const res = await fetch('http://localhost:8080/workout/likes/new', {
    method: 'PATCH',
    headers: { 
      'Content-Type': 'application/json',
      'X-Authorization': localStorage.getItem('accessToken') ?? ''
    },
    body: JSON.stringify({ id: workoutId })
  });
  if (!res.ok) {
    throw new Error('Adding workout like failed');
  }
}

export async function fetchAddDislike(workoutId: number) {
  const res = await fetch('http://localhost:8080/workout/dislikes/new', {
    method: 'PATCH',
    headers: { 
      'Content-Type': 'application/json',
      'X-Authorization': localStorage.getItem('accessToken') ?? ''
    },
    body: JSON.stringify({ id: workoutId })
  });
  if (!res.ok) {
    throw new Error('Adding workout dislike failed');
  }
}

export async function fetchRemoveLike(workoutId: number) {
  const res = await fetch('http://localhost:8080/workout/likes/delete', {
    method: 'PATCH',
    headers: { 
      'Content-Type': 'application/json',
      'X-Authorization': localStorage.getItem('accessToken') ?? ''
    },
    body: JSON.stringify({ id: workoutId })
  });
  if (!res.ok) {
    throw new Error('Removing workout like failed');
  }
}

export async function fetchRemoveDislike(workoutId: number) {
  const res = await fetch('http://localhost:8080/workout/dislikes/delete', {
    method: 'PATCH',
    headers: { 
      'Content-Type': 'application/json',
      'X-Authorization': localStorage.getItem('accessToken') ?? ''
    },
    body: JSON.stringify({ id: workoutId })
  });
  if (!res.ok) {
    throw new Error('Removing workout dislike failed');
  }
}

export async function fetchProfiles(sortString: string, limit: number, offset: number) {
  const res = await fetch(`http://localhost:8080/profiles/all?limit=${limit}&offset=${offset}`, { // limit is how many i want and offset is at which im on
    method: 'GET',
    headers: { 
      'Content-Type': 'application/json',
      'X-Authorization': localStorage.getItem('accessToken') ?? ''
    },
    body: JSON.stringify({ beginWith: sortString })
  });
  if (!res.ok) {
    throw new Error('Loading profiles failed');
  }

  const { profiles } = await res.json();
  return profiles;
}

export async function tempRegisterUser( name: string, password: string, confirmPass: string ) {
  await new Promise((resolve) => setTimeout(resolve, 5000));
  localStorage.setItem('accessToken', '1');
}

export async function tempLoginUser( name: string, password: string ) {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  localStorage.setItem('accessToken', '1');
}

export async function tempFetchProfileInfo(id?: number) {
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

let commentId = 10;
export async function tempFetchNewComment(comment: string, workoutId: number) {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  commentId++;

  return commentId;
}

export async function tempFetchEditComment(newComment: string, workoutId: number, commentId: number) {
  await new Promise((resolve) => setTimeout(resolve, 2000));
}

export async function tempFetchAddLike(workoutId: number) {

}

export async function tempFetchAddDislike(workoutId: number) {

}

export async function tempFetchRemoveLike(workoutId: number) {

}

export async function tempFetchRemoveDislike(workoutId: number) {

}

export async function tempFetchProfiles(sortString: string, limit: number, offset: number) {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const users = profilesList.filter(profile => profile.name.startsWith(sortString));
  return users;
}