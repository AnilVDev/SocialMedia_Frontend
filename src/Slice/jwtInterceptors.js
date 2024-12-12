

import axios from "axios";
import { refreshAccessToken, reset } from "./authSlice";
import { useDispatch } from "react-redux";


const  api = process.env.REACT_APP_REST_API

const createJwtInterceptors = () => {
    const jwtInterceptors = axios.create({});
    const dispatch = useDispatch();

    jwtInterceptors.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        if (error.response.status === 401) {
        try {
        
            const newAccessToken = await dispatch(refreshAccessToken());
            error.config.headers.Authorization = `Bearer ${newAccessToken.access}`;
            return axios(error.config); 
        } catch (refreshError) {
            localStorage.removeItem('user');
            return Promise.reject(refreshError);
        }
        }
        return Promise.reject(error);
    }
    );

    return jwtInterceptors;
};

export default createJwtInterceptors;