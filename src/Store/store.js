import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../Slice/authSlice'
import adminReducer from '../Slice/adminSlice'
import postReducer from '../Slice/postSlice'
import onlineStatusReducer from '../Slice/onlineStatusSlice'
import messageNotifyReducer from '../Slice/messageNotificationSlice'

export const store = configureStore({
    reducer: {
        auth:authReducer,
        admin:adminReducer,
        post:postReducer,
        onlineStatus:onlineStatusReducer,
        messageNotify: messageNotifyReducer,
    },
  });
  