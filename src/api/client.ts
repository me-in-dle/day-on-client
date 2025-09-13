import axios from 'axios';
import { Account, LoginResponse } from '../store/types';

export const apiClient = axios.create({
    baseURL: 'http://localhost:8080/api', // api-gateway
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 5000,
});

apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers = {
            ...config.headers,
            Authorization: `Bearer ${token}`,
        };
    }
    console.log('Request Config:', config);
    return config;
}, (error) => {
    return Promise.reject(error);
});

apiClient.interceptors.response.use((response) => {
    console.log('Response:', response);
    return response;
}, (error) => {
    if (error.response) {
        console.error('Response Error:', error.response);
    } else {
        console.error('Error:', error.message);
    }

    if (error.response && error.response.status === 401) {
        // Handle unauthorized access, e.g., redirect to login
        console.warn('Unauthorized! Redirecting to login...');
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
    }

    return Promise.reject(error);
});
export const authAPI = {
    // 구글 로그인
    googleLogin: async (code: string) => {
        const response = await apiClient.post<LoginResponse>('/auth/google', { code });
        return response;
    },

    // 카카오 로그인
    kakaoLogin: async (code: string) => {
        const response = await apiClient.post<LoginResponse>('/auth/kakao', { code });
        return response;
    },

    // 로그아웃
    logout: async () => {
        const response = await apiClient.post<void>('/auth/logout');
        return response;
    },

    // 유저 정보 조회
    getUserInfo: async () => {
        const response = await apiClient.get<Account>('/auth/me');
        return response;
    },
};