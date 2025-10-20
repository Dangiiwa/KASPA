import type { LoginPayload, RegisterPayload, ResponsePayload, UserData } from '../types';
import { $axios } from './api';

const auth = '/auth';

export const login = async (payload: LoginPayload): Promise<{ 
  access_token: string; 
  refresh_token: string; 
  message: string;
}> => {
  return $axios.post(`${auth}/login/`, payload);
};

export const register = async (payload: RegisterPayload): Promise<ResponsePayload> => {
  return $axios.post(`${auth}/register/`, payload);
};

export const getProfile = async (access_token?: string): Promise<UserData> => {
  const headers = access_token ? { Authorization: `Bearer ${access_token}` } : {};
  return $axios.get(`${auth}/profile/`, { headers });
};

export const updateProfile = async (payload: { 
  first_name: string; 
  last_name: string; 
  phone: string; 
  business_name: string; 
}): Promise<UserData> => {
  return $axios.put(`${auth}/profile/`, payload);
};

export const refreshToken = async (refreshToken: string): Promise<ResponsePayload> => {
  return $axios.post(`${auth}/token/refresh/`, { refresh: refreshToken });
};

export const logoutUser = async (token: string): Promise<ResponsePayload> => {
  return $axios.post(`${auth}/logout/`, { refresh: token });
};

export const forgotPassword = async (email: string): Promise<ResponsePayload> => {
  return $axios.post(`${auth}/forgot-password/`, { email });
};

export const resetPassword = async (token: string, password: string): Promise<ResponsePayload> => {
  return $axios.post(`${auth}/reset-password/${token}`, { password });
};