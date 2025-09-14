import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch } from '../store/store';
import { setAuthFromCookies } from '../store/slices/authSlice';

const DAY_ON_ACCESS_TOKEN_NAME = "dayOnAccessToken";
const DAY_ON_REFRESH_TOKEN_NAME = "dayOnRefreshToken";

// 쿠키에서 값을 가져오는 유틸리티 함수
const getCookie = (name: string): string | null => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        return parts.pop()?.split(';').shift() || null;
    }
    return null;
};

export const AuthCallback: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    useEffect(() => {
        const handleAuthCallback = async () => {
            try {
                // 쿠키에서 토큰 가져오기
                const accessToken = getCookie(DAY_ON_ACCESS_TOKEN_NAME);
                const refreshToken = getCookie(DAY_ON_REFRESH_TOKEN_NAME);

                if (accessToken && refreshToken) {
                    // 토큰을 store에 저장하고 사용자 정보 가져오기
                    await dispatch(setAuthFromCookies({
                        accessToken,
                        refreshToken
                    })).unwrap();

                    // 성공적으로 인증되면 대시보드로 리디렉션
                    navigate('/dashboard', { replace: true });
                } else {
                    // 토큰이 없으면 로그인 페이지로 리디렉션
                    console.error('토큰이 쿠키에서 찾을 수 없습니다.');
                    navigate('/login', { replace: true });
                }
            } catch (error) {
                console.error('인증 콜백 처리 중 오류:', error);
                navigate('/login', { replace: true });
            }
        };

        handleAuthCallback();
    }, [dispatch, navigate]);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-4 text-gray-600">로그인 처리 중...</p>
            </div>
        </div>
    );
};