import axios from 'axios';
import { store } from '../redux/store';
import { logout } from '../redux/slices/userSlice';
import { enqueueSnackbar } from 'notistack';

export const baseURL = import.meta.env.VITE_APP_BASE_URL;

const $axios = axios.create({
  baseURL,
});

$axios.interceptors.request.use((config) => {
  const state = store.getState();
  const token = state.user.userData?.access_token;
  
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  
  config.headers['Content-Type'] = config.headers['Content-Type'] || 'application/json';
  return config;
});

$axios.interceptors.response.use(
  (response) => {
    return Promise.resolve(response?.data || {});
  },
  (error) => {
    if ((error?.response?.status === 401 || error?.status === 401) && 
        !error?.config?.url?.includes('login')) {
      enqueueSnackbar('Session expired. Please login again.', { variant: 'error' });
      store.dispatch(logout());
      return Promise.reject(error);
    } else {
      return Promise.reject(error?.response?.data || { message: 'An error occurred' });
    }
  }
);

export { $axios };