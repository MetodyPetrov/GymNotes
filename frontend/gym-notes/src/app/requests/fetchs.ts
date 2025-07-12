import dayjs, { Dayjs } from "dayjs";
import { CommentModel, ExerciseModel, ExerciseTemplate, WorkoutModel } from "../types/Workout.types";
import api from "./api";
import { exampleUser, exercisesList, leaderboard, profilesList, workoutsList } from "./tempData.js";

export async function registerUser( name: string, password: string, confirmPass: string ) {
  try {
    const response = await api.post('/register', {
      username: name,
      password: password,
      confirmPassword: confirmPass,
      email: 'foncho@gmail.com',
    });

    const { messages } = response.data;

    alert(messages);
  } catch (error: any) {
    const errorMessages = error.response?.data?.errorMessages || ['Registration failed'];
    throw new Error(errorMessages.join('\n'));
  }
}

export async function loginUser( name: string, password: string ) {
  try {
    const response = await api.post('/login', {
      username: name,
      password: password
    });

    const { token } = response.data;

    alert('Successful login');
    localStorage.setItem('accessToken', token.access_token);
    localStorage.setItem('username', name);
  } catch (error: any) {
    const errorMessages = error.response?.data?.errorMessages || ['Login failed'];
    throw new Error(errorMessages.join('\n'));
  }
}

export async function fetchProfileInfo(id?: number) {
  try{
    const res = await api.get('/profiles/user/info', {
      params: { userId: id }
    });

    return res.data;
  } catch (error: any) {
    const errorMessages = error.response?.data?.errorMessages || ['Error fetching profile data'];
    throw new Error(errorMessages.join('\n'));
  }
}

export async function fetchExercisesList(limit: number, offset: number) {
  try {
    const res = await api.get('/exercises/templates', {
      params: {
        limit,
        offset
      }
    });

    const exercises = res.data.map((exercise: {
      name: string;
      creatorUsername: string;
      tags: string[];
      hasReps: boolean;
      hasVolume: boolean;
      hasDuration: boolean;
      hasDistance: boolean;
    }) => ({
      name: exercise.name,
      creatorUsername: exercise.creatorUsername,
      tags: exercise.tags,
      reps: exercise.hasReps ? 0 : null,
      volume: exercise.hasVolume ? 0 : null,
      duration: exercise.hasDuration ? 0 : null,
      distance: exercise.hasDistance ? 0 : null,
    }));

    return exercises;
  } catch (error: any) {
    const errorMessages = error.response?.data?.errorMessages || ['An error occurred while trying to load exercise options'];
    throw new Error(errorMessages.join('\n'));
  }
}

export async function fetchWorkoutExercises(workoutId: number) {
  try {
    const res = await api.get('/workouts/exercises', {
      params: { id: workoutId },
    });

    return res.data as ExerciseModel[];
  } catch (error: any) {
    const errorMessages = error.response?.data?.errorMessages || [('An error occurred while tring to load exercises for workout ' + workoutId)];
    throw new Error(errorMessages.join('\n'));
  }
}

export async function fetchSubmitNewExercise(exercise: ExerciseTemplate) {
  const tags = exercise.tags.filter(tag => tag.trim() !== '');

  try {
    const { data } = await api.post('/exercises/templates/new', { 
      name: exercise.name,
      workoutTags: tags,
      hasReps: exercise.reps,
      hasVolume: exercise.volume,
      hasDistance: exercise.distance,
      hasDuration: exercise.duration
    });

    alert(data.messages);
  } catch (error: any) {
    const errorMessages = error.response?.data?.errorMessages || ['An error occurred while trying to create a new exercise'];
    throw new Error(errorMessages.join('\n'));
  }
}

export async function fetchPersonalWorkoutList(limit: number, offset: number, date: Dayjs, id?: number) {
  try {
    const { data } = await api.get('/workouts/list', {
      params: {
        userId: id,
        limit,
        offset,
        date
      }
    });

    return data as WorkoutModel[];
  } catch (error: any) {
    const errorMessages = error.response?.data?.errorMessages || ['An error occurred while trying to fetch the personal workout list'];
    throw new Error(errorMessages.join('\n'));
  }
}

export async function fetchComments(workoutId: number) {
  try {
    const response = await api.get('/workouts/comments', {
      params: { id: workoutId }
    });

    const comments: CommentModel[] = response.data;
    return comments;
  } catch (error: any) {
    const errorMessages = error.response?.data?.errorMessages || ['An error occurred while loadng the comments for workout ' + workoutId];
    throw new Error(errorMessages.join('\n'));
  }
}

export async function fetchNewComment(comment: string, workoutId: number) {
  try {
    const { data } = await api.post('/workouts/comments/new', {
      id: workoutId,
      comment: comment
    });

    return data.id;
  } catch (error: any) {
    const errorMessages = error.response?.data?.errorMessages || ['An error occurred while submitting comment'];
    throw new Error(errorMessages.join('\n'));
  }
}

export async function fetchEditComment(newComment: string, workoutId: number, commentId: number) {
  try {
    await api.patch('/workouts/comments/edit', {
      commentId,
      workoutId,
      comment: newComment
    });
  } catch (error: any) {
    const errorMessages = error.response?.data?.errorMessages || ['An error occurred while submitting the edited comment'];
    throw new Error(errorMessages.join('\n'));
  }
}

export async function fetchAddLike(workoutId: number) {
  try {
    await api.patch(`/workouts/${workoutId}/likes/new`);
  } catch (error: any) {
    const errorMessages = error.response?.data?.errorMessages || ['An error occurred while submitting like'];
    throw new Error(errorMessages.join('\n'));
  }
}

export async function fetchAddDislike(workoutId: number) {
  try {
    await api.patch(`/workouts/${workoutId}/dislikes/new`);
  } catch (error: any) {
    const errorMessages = error.response?.data?.errorMessages || ['An error occurred while submitting dislike'];
    throw new Error(errorMessages.join('\n'));
  }
}

export async function fetchRemoveLike(workoutId: number) {
  try {
    await api.patch(`/workouts/${workoutId}/likes/delete`);
  } catch (error: any) {
    const errorMessages = error.response?.data?.errorMessages || ['An error occurred while removing like'];
    throw new Error(errorMessages.join('\n'));
  }
}

export async function fetchRemoveDislike(workoutId: number) {
  try {
    await api.patch(`/workouts/${workoutId}/dislikes/delete`);
  } catch (error: any) {
    const errorMessages = error.response?.data?.errorMessages || ['An error occurred while removing dislike'];
    throw new Error(errorMessages.join('\n'));
  }
}

export async function fetchProfiles(sortString: string, limit: number, offset: number) {
  try {
    const response = await api.get('/profiles/all', {
      params: {
        limit,
        offset,
        beginWith: sortString
      }
    });

    const { profiles } = response.data;
    return profiles;
  } catch (error: any) {
    const errorMessages = error.response?.data?.errorMessages || ['An error occurred while fetching profiles'];
    throw new Error(errorMessages.join('\n'));
  }
}

export async function fetchLeaderboard() {
  try {
    const response = await api.get('/leaderboard');
    return response.data;
  } catch (error: any) {
    const errorMessages = error.response?.data?.errorMessages || ['An error occurred while fetching leaderboard'];
    throw new Error(errorMessages.join('\n'));
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

export async function tempFetchProfileInfo(id?: number) {
  await new Promise(res => setTimeout(res, 500));
  return id ? profilesList.find(profile => profile.id === id ) : exampleUser;
}

export async function tempFetchExercisesList(limit: number, offset: number) {
  await new Promise(res => setTimeout(res, 2000));
  return exercisesList.slice(offset, offset + limit);
}

export async function tempFetchPersonalWorkoutList(limit: number, offset: number, date?: Dayjs, id?: number) {
  await new Promise(res => setTimeout(res, 0));
  const workouts = date ? workoutsList.filter(workout => dayjs(workout.dateCreated).isSame(date, 'day') ) : workoutsList;
  console.log(limit, offset, workouts.slice(offset, offset + limit));
  return workouts.slice(offset, offset + limit);
}

export async function tempFetchSubmitNewWorkout(workout: ExerciseModel[]) {
  
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
  await new Promise((resolve) => setTimeout(resolve, 2000));
  const users = profilesList.filter(profile => profile.name.startsWith(sortString));
  return users.slice(offset, offset + limit);
}

export async function tempFetchLeaderboard() {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return leaderboard;
}