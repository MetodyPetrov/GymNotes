import dayjs, { Dayjs } from "dayjs";
import { CommentModel, ExerciseModel, ExerciseSet, ExerciseTemplate, WorkoutModel } from "../types/Workout.types";
import api from "./api";
import { exampleUser, exercisesList, leaderboard, profilesList, workoutsList } from "./tempData.js";

export async function registerUser( name: string, password: string, confirmPass: string, email: string ) {
  try {
    const response = await api.post('/register', {
      username: name,
      password: password,
      confirmPassword: confirmPass,
      email
    });
    await new Promise(res => setTimeout(res, 2000));

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
    await new Promise(res => setTimeout(res, 2000));

    const { token } = response.data;

    alert('Successful login');
    localStorage.setItem('accessToken', token.access_token);
    localStorage.setItem('username', name);
  } catch (error: any) {
    const errorMessages = error.response?.data?.errorMessages || ['Login failed'];
    throw new Error(errorMessages.join('\n'));
  }
}

export async function fetchProfileInfo(id?: string) {
  try{
    const res = await api.get('/profiles/user/info', {
      params: { id }
    });
    await new Promise(res => setTimeout(res, 2000));
    return res.data;
  } catch (error: any) {
    const errorMessages = error.response?.data?.errorMessages || ['Error fetching profile data'];
    throw new Error(errorMessages.join('\n'));
  }
}

export async function fetchExercisesList(limit: number, offset: number) {
  try {
    const res = await api.get('/exercises', {
      params: {
        limit,
        offset
      }
    });
    await new Promise(res => setTimeout(res, 2000));

    const exercises = res.data.content.map((exercise: {
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
      reps: exercise.hasReps,
      volume: exercise.hasVolume,
      duration: exercise.hasDuration,
      distance: exercise.hasDistance,
    }));
    const { last } = res.data;
    return {exercises, last};
  } catch (error: any) {
    const errorMessages = error.response?.data?.errorMessages || ['An error occurred while trying to load exercise options'];
    throw new Error(errorMessages.join('\n'));
  }
}

export async function fetchSubmitNewExercise(exercise: ExerciseTemplate) {
  const tags = exercise.tags.filter(tag => tag.trim() !== '');

  try {
    const { data } = await api.post('/exercises/new', { 
      name: exercise.name,
      workoutTags: tags,
      hasReps: exercise.reps,
      hasVolume: exercise.volume,
      hasDistance: exercise.distance,
      hasDuration: exercise.duration
    });
    await new Promise(res => setTimeout(res, 2000));

    alert(data.messages);
  } catch (error: any) {
    const errorMessages = error.response?.data?.errorMessages || ['An error occurred while trying to create a new exercise'];
    throw new Error(errorMessages.join('\n'));
  }
}

export async function fetchPersonalWorkoutList({ limit, offset, date, id } : { limit: number, offset: number, date?: Dayjs, id?: string }) {
  try {
    const { data } = await api.get('/workouts/list', {
      params: {
        id,
        limit,
        offset,
        date: date?.format('YYYY-MM-DD')
      }
    });
    await new Promise(res => setTimeout(res, 2000));
    return data as WorkoutModel[];
  } catch (error: any) {
    const errorMessages = error.response?.data?.errorMessages || ['An error occurred while trying to fetch the personal workout list'];
    throw new Error(errorMessages.join('\n'));
  }
}

export async function fetchSubmitNewWorkout(workout: ExerciseModel[]) {
  try {
    const { data } = await api.post('/workouts/new', {
      exercises: workout
    });
    await new Promise(res => setTimeout(res, 2000));

    return data as WorkoutModel[];
  } catch (error: any) {
    const errorMessages = error.response?.data?.errorMessages || ['An error occurred while trying to fetch the personal workout list'];
    throw new Error(errorMessages.join('\n'));
  }
}

export async function fetchAddSet(set: ExerciseSet, workoutId: string, exerciseId: string, index: number) {
  try {
    const { data } = await api.post(`/workouts/${workoutId}/exercises/${exerciseId}/add/set`, {
      ...set,
      id: null,
      exerciseIndex: index
    });
    await new Promise(res => setTimeout(res, 2000));

    alert(data.messages);
  } catch (error: any) {
    const errorMessages = error.response?.data?.errorMessages || ['An error occurred while trying to add set'];
    throw new Error(errorMessages.join('\n'));
  }
}

export async function fetchRemoveSet(setId: string) {
  try {
    const { data } = await api.delete(`/sets/${setId}`);
    await new Promise(res => setTimeout(res, 2000));
    
    alert(data.messages);
  } catch (error: any) {
    const errorMessages = error.response?.data?.errorMessages || ['An error occurred while trying to remove set'];
    throw new Error(errorMessages.join('\n'));
  }
}

export async function fetchEditSet(set: ExerciseSet, setId: string) {
  try {
    const { data } = await api.put(`/sets`, {
      ...set,
      id: setId
    });
    await new Promise(res => setTimeout(res, 2000));

    alert(data.messages);
  } catch (error: any) {
    const errorMessages = error.response?.data?.errorMessages || ['An error occurred while trying to edit set'];
    throw new Error(errorMessages.join('\n'));
  }
}

export async function fetchComments(workoutId: string) {
  try {
    const response = await api.get('/workouts/comments', {
      params: { workoutId: workoutId }
    });
    await new Promise(res => setTimeout(res, 2000));

    const comments: CommentModel[] = response.data;
    return comments;
  } catch (error: any) {
    const errorMessages = error.response?.data?.errorMessages || ['An error occurred while loadng the comments for workout ' + workoutId];
    throw new Error(errorMessages.join('\n'));
  }
}

export async function fetchNewComment(comment: string, workoutId: string) {
  try {
    const { data } = await api.post('/workouts/comments/new', {
      id: workoutId,
      comment: comment
    });
    await new Promise(res => setTimeout(res, 2000));

    return data.id;
  } catch (error: any) {
    const errorMessages = error.response?.data?.errorMessages || ['An error occurred while submitting comment'];
    throw new Error(errorMessages.join('\n'));
  }
}

export async function fetchEditComment(newComment: string, commentId: string) {
  try {
    await api.patch('/workouts/comments/edit', {
      commentId,
      comment: newComment
    });
    await new Promise(res => setTimeout(res, 2000));

  } catch (error: any) {
    const errorMessages = error.response?.data?.errorMessages || ['An error occurred while submitting the edited comment'];
    throw new Error(errorMessages.join('\n'));
  }
}

export async function fetchAddLike(workoutId: string) {
  try {
    await api.patch(`/workouts/${workoutId}/likes/new`);
    await new Promise(res => setTimeout(res, 2000));
  } catch (error: any) {
    const errorMessages = error.response?.data?.errorMessages || ['An error occurred while submitting like'];
    throw new Error(errorMessages.join('\n'));
  }
}

export async function fetchAddDislike(workoutId: string) {
  try {
    await api.patch(`/workouts/${workoutId}/dislikes/new`);
    await new Promise(res => setTimeout(res, 2000));
  } catch (error: any) {
    const errorMessages = error.response?.data?.errorMessages || ['An error occurred while submitting dislike'];
    throw new Error(errorMessages.join('\n'));
  }
}

export async function fetchRemoveLike(workoutId: string) {
  try {
    await api.patch(`/workouts/${workoutId}/likes/delete`);
    await new Promise(res => setTimeout(res, 2000));
  } catch (error: any) {
    const errorMessages = error.response?.data?.errorMessages || ['An error occurred while removing like'];
    throw new Error(errorMessages.join('\n'));
  }
}

export async function fetchRemoveDislike(workoutId: string) {
  try {
    await api.patch(`/workouts/${workoutId}/dislikes/delete`);
    await new Promise(res => setTimeout(res, 2000));
  } catch (error: any) {
    const errorMessages = error.response?.data?.errorMessages || ['An error occurred while removing dislike'];
    throw new Error(errorMessages.join('\n'));
  }
}

export async function fetchProfiles(sortString: string, limit: number, offset: number) {
  try {
    const response = await api.get('/profiles', {
      params: {
        limit,
        offset,
        beginWith: sortString
      }
    });
    await new Promise(res => setTimeout(res, 2000));

    const profilesList = response.data.content;
    const last = response.data.last;
    return { profilesList, last };
  } catch (error: any) {
    const errorMessages = error.response?.data?.errorMessages || ['An error occurred while fetching profiles'];
    throw new Error(errorMessages.join('\n'));
  }
}

export async function fetchLeaderboard() {
  try {
    const response = await api.get('/leaderboard');
    await new Promise(res => setTimeout(res, 2000));

    return response.data;
  } catch (error: any) {
    const errorMessages = error.response?.data?.errorMessages || ['An error occurred while fetching leaderboard'];
    throw new Error(errorMessages.join('\n'));
  }
}

// export async function tempRegisterUser( name: string, password: string, confirmPass: string ) {
//   await new Promise((resolve) => setTimeout(resolve, 5000));
//   localStorage.setItem('accessToken', '1');
// }

// export async function tempLoginUser( name: string, password: string ) {
//   await new Promise((resolve) => setTimeout(resolve, 2000));
//   localStorage.setItem('accessToken', '1');
// }

// export async function tempFetchProfileInfo(id?: string) {
//   await new Promise(res => setTimeout(res, 500));
//   return id ? profilesList.find(profile => profile.id === id ) : exampleUser;
// }

// export async function tempFetchExercisesList(limit: number, offset: number) {
//   await new Promise(res => setTimeout(res, 2000));
//   return exercisesList.slice(offset, offset + limit);
// }

// export async function tempFetchPersonalWorkoutList({ limit, offset, date, id } : { limit: number, offset: number, date?: Dayjs, id?: string }) {
//   await new Promise(res => setTimeout(res, 0));
//   const workouts = date ? workoutsList.filter(workout => dayjs(workout.dateCreated).isSame(date, 'day') ) : workoutsList;
//   return workouts.slice(offset, offset + limit);
// }

// export async function tempFetchSubmitNewWorkout(workout: ExerciseModel[]) {
  
// }

// export async function tempFetchSubmitNewExercise(exercise: ExerciseTemplate) {

// }

// export async function tempFetchComments(workoutId: string) {
//   const comments: CommentModel[] = [];
//   for(let i = 0; i < workoutsList.length; i++) {
//     if(workoutsList[i].id === workoutId) comments.push(...workoutsList[i].comments);
//   }
//   await new Promise(res => setTimeout(res, 2000));

//   return comments;
// }

// let commentId = 10;
// export async function tempFetchNewComment(comment: string, workoutId: string) {
//   await new Promise((resolve) => setTimeout(resolve, 2000));
//   commentId++;
//   return commentId.toString();
// }

// export async function tempFetchEditComment(newComment: string, commentId: string) {
//   await new Promise((resolve) => setTimeout(resolve, 2000));
// }

// export async function tempFetchAddLike(workoutId: string) {

// }

// export async function tempFetchAddDislike(workoutId: string) {

// }

// export async function tempFetchRemoveLike(workoutId: string) {

// }

// export async function tempFetchRemoveDislike(workoutId: string) {

// }

// export async function tempFetchProfiles(sortString: string, limit: number, offset: number) {
//   await new Promise((resolve) => setTimeout(resolve, 2000));
//   const users = profilesList.filter(profile => profile.name.startsWith(sortString));
//   return users.slice(offset, offset + limit);
// }

// export async function tempFetchLeaderboard() {
//   await new Promise((resolve) => setTimeout(resolve, 1000));
//   return leaderboard;
// }