import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice'; 
import projectReducer from './projectUser'; 
import articleReducer from './articleUser'; 
import notificationReducer from './notificationReducer';


export const store = configureStore({
  reducer: {
    user: userReducer,
    project: projectReducer,
    article: articleReducer,
    notification: notificationReducer,
  },
});
