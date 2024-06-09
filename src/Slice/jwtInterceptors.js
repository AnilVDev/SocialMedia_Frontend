

import axios from "axios";
import { refreshAccessToken, reset } from "./authSlice";
import { useDispatch } from "react-redux";


// const api ="http://127.0.0.1:8000/api/"
const  api = process.env.REACT_APP_REST_API

const createJwtInterceptors = () => {
    const jwtInterceptors = axios.create({});
    const dispatch = useDispatch();

    jwtInterceptors.interceptors.response.use(
    (response) => {
        console.log("success")
        return response;
    },
    async (error) => {
        console.log("failed")
        if (error.response.status === 401) {
        try {
        
            const newAccessToken = await dispatch(refreshAccessToken());
            error.config.headers.Authorization = `Bearer ${newAccessToken.access}`;
            // localStorage.setItem('user', JSON.stringify(newAccessToken))
            return axios(error.config); 
        } catch (refreshError) {
            console.error('Refresh token failed:', refreshError);
            localStorage.removeItem('user');
            // dispatch(reset());
            return Promise.reject(refreshError);
        }
        }
        return Promise.reject(error);
    }
    );

    return jwtInterceptors;
};

export default createJwtInterceptors;