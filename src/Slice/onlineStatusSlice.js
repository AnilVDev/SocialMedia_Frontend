import { createSlice } from "@reduxjs/toolkit";




export const onlineStatusSlice = createSlice({
    name : 'onlineStatus',
    initialState: {
        userOnline :{}
    },
    reducers:{
        updateUserStatus: (state, action) => {
            const { userId, status } = action.payload;
            state.userOnline[userId] = status; 
        },
    }
})
    

export const { updateUserStatus } = onlineStatusSlice.actions;

export default onlineStatusSlice.reducer;