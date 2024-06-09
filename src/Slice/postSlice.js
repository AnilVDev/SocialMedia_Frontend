import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import postService from './postService';
import axios from 'axios';


const graphqlUrl = process.env.REACT_APP_GRAPHQL_API

const initialState = {
    userBio:null,
    userPost:{},
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
  }; 
  

  // get user bio
  export const getBio = createAsyncThunk('post/getBio',
    async (axiosInstance,thunkAPI) => {
      const query = `
      query {
        user {
          firstName
          lastName
          username
          profilePicture
          bio
        }
        }`;
        try {
          const accessToken = thunkAPI.getState().auth.user.access
          console.log('g e t b i o',accessToken)
          if (!accessToken) {
            return thunkAPI.rejectWithValue('Access token is missing');
          }
            const response = await postService.getBio(axiosInstance, {query}, accessToken)
            if (!response) {
                return thunkAPI.rejectWithValue('Failed to get your info');
              }
              return response
        }catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
            console.log("get User details graph --**-",error.response, error.response.data, error.response.data.message, error.message)
            return thunkAPI.rejectWithValue(message);         
        }
    }
  )

  export const postSlice = createSlice({
    name: 'post',
    initialState,
    reducers : {
        resetPost: (state) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = false;
            state.message = '';
        },
    },
    extraReducers: (builder) => {
        builder
        .addCase(getBio.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(getBio.fulfilled, (state,action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.userBio = action.payload.data.user;
        })
        .addCase(getBio.rejected, (state,action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
            state.userBio = null;
          })
    }
  })


  export const {resetPost} = postSlice.actions
  export default postSlice.reducer