import { createSlice } from "@reduxjs/toolkit"



export const messageNotificationSlice = createSlice({
    name: 'messageNotification',
    initialState:{
        messageNotifyCount:0,
        notifications: [],
        newPost:false,
        isMessageSent: false, 
    },
    reducers:{
        updateUserMessageNotify:(state, action) =>{
            state.messageNotifyCount = action.payload.count
        },
        clearMessageCount:(state) =>{
            state.messageNotifyCount = 0
        },
        addNotification: (state, action) => {
            const newNotification = action.payload.notification;
            const existingNotificationIndex = state.notifications.findIndex(notification => notification.id === newNotification.id);
            
            if (existingNotificationIndex === -1) {
                state.notifications.push(newNotification);
            }
        },
        updateNewPost:(state) =>{
            state.newPost = true
        },
        clearNotifications: (state) => {
            state.notifications = [];
        },
        clearNewPost:(state) =>{
            state.newPost = false;
        },
        setMessageSent: (state) => { 
            state.isMessageSent = true;
        },
        resetMessageSent: (state) => { 
            state.isMessageSent = false;
        },
    } 
})

export const { updateUserMessageNotify, clearMessageCount, addNotification, updateNewPost, clearNotifications, clearNewPost, setMessageSent, resetMessageSent  } = messageNotificationSlice.actions;

export default messageNotificationSlice.reducer;