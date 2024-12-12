import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import {jwtDecode} from 'jwt-decode';
import dayjs from 'dayjs';
import { updateToken } from './authSlice';
import { toast } from 'react-toastify';

const baseURL = process.env.BASE_URL

const useAxios = () => {

    const dispatch = useDispatch()
    const {user} = useSelector(state=>state.auth)

    const axiosInstance = axios.create({
        baseURL,
        headers:{Authorization: `Bearer ${user?.access}`}
    });

    axiosInstance.interceptors.request.use(async req => {
    
        const userToken = jwtDecode(user.access)
        const isExpired = dayjs.unix(userToken.exp).diff(dayjs()) < 1; 
    
        if(!isExpired) return req

        try {
            const response = await dispatch(updateToken());
            req.headers.Authorization = `Bearer ${response.payload.access}`;
            return req;
          } catch (error) { 
              toast.error(error);
            throw error;
          }
    })
    
    return axiosInstance

}

export default useAxios