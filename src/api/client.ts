import axios from 'axios';
import { Account, LoginResponse } from '../store/types';

// 쿠키에서 특정 값을 가져오는 유틸리티 함수
const getCookie = (name: string): string | null => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        return parts.pop()?.split(';').shift() || null;
    }
    return null;
};

export const apiClient = axios.create({
    baseURL: 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 5000,
    withCredentials: true, // 쿠키를 포함한 요청을 위해 필요
});

// Request Interceptor - 쿠키에서 토큰을 가져와서 Authorization 헤더에 설정
apiClient.interceptors.request.use((config) => {
    const token = getCookie('dayOnAccessToken');
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

// Response Interceptor - 401 에러시 토큰 갱신 시도
apiClient.interceptors.response.use(
    (response) => {
        console.log('Response:', response);
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        if (error.response) {
            console.error('Response Error:', error.response);
        } else {
            console.error('Error:', error.message);
        }

        // 401 에러이고 토큰 갱신을 시도하지 않은 요청인 경우
        if (error.response && error.response.status === 403 && !originalRequest._retry && error.response.data.errorCode === "APGW0004") {
            originalRequest._retry = true;

            try {
                const refreshToken = getCookie('dayOnRefreshToken');
                console.log("토큰 갱신 요청")
                if (refreshToken) {
                    // 토큰 갱신 API 호출
                    const refreshResponse = await axios.post('/api/auth/refresh',
                        { refreshToken },
                        {
                            baseURL: 'http://localhost:8080',
                            withCredentials: true
                        }
                    );

                    // 새로운 토큰으로 원래 요청 재시도
                    const newToken = getCookie('dayOnAccessToken');
                    if (newToken) {
                        originalRequest.headers.Authorization = `Bearer ${newToken}`;
                        return apiClient(originalRequest);
                    }
                }
            } catch (refreshError) {
                console.error('토큰 갱신 실패:', refreshError);
            }

            // 토큰 갱신 실패시 로그인 페이지로 리디렉션
            console.warn('Unauthorized! Redirecting to login...');

            // 쿠키 삭제
            document.cookie = 'dayOnAccessToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Strict';
            document.cookie = 'dayOnRefreshToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Strict';

            window.location.href = '/login';
        }

        return Promise.reject(error);
    }
);

export const authAPI = {
    // 구글 로그인 URL로 리디렉션
    redirectToGoogleLogin: () => {
        const GOOGLE_CLIENT_ID = import.meta.env.VITE_APP_GOOGLE_CLIENT_ID || 'your-google-client-id.apps.googleusercontent.com';
        const REDIRECT_URI = import.meta.env.VITE_APP_GOOGLE_REDIRECT_URL || window.location.origin;
        const SCOPE = 'openid email profile';

        const googleOAuthURL = `https://accounts.google.com/o/oauth2/v2/auth?` +
            `client_id=${GOOGLE_CLIENT_ID}&` +
            `redirect_uri=${REDIRECT_URI}&` +
            `response_type=code&` +
            `scope=${SCOPE}&` +
            `state=google&` +
            `access_type=offline&` +
            `prompt=consent`;

        window.location.href = googleOAuthURL;
    },

    // 카카오 로그인 URL로 리디렉션  
    redirectToKakaoLogin: () => {
        window.location.href = 'http://localhost:8080/api/oauth2/authorization/kakao';
    },

    // 로그아웃
    logout: async () => {
        const response = await apiClient.post<void>('/v1/logout');
        return response;
    },

    // 유저 정보 조회
    getUserInfo: async () => {
        const response = await apiClient.get<Account>('/v1/account/info');
        console.log("response = ", response)
        return response;
    },

    // 토큰 갱신
    refreshToken: async (refreshToken: string) => {
        const response = await axios.post<LoginResponse>('/v1/account/refreshToken',
            { refreshToken },
            {
                baseURL: 'http://localhost:8080',
                withCredentials: true
            }
        );
        return response;
    },
};