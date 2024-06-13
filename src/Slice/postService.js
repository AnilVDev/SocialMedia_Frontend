import axios from 'axios';
import { postSlice } from './postSlice';

const graphqlUrl = process.env.REACT_APP_GRAPHQL_API


// get user bio
const getBio = async (axiosInstance,{query},accessToken) => {
    const config = {
        headers: {
            "Authorization": `Bearer ${accessToken}`
        }
    }
    const response = await axiosInstance.post(graphqlUrl,{query},config)
    return response.data
}

// create new post
const createPost = async (axiosInstance,{mutation},accessToken) => {
    const config = {
        headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json"
        }
    }
    const response = await axiosInstance.post(graphqlUrl,{mutation},config)
    return response.data
}


const postService = {
    getBio,createPost
}

export default postService