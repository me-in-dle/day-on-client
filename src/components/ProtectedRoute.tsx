import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { setAuthFromCookies } from '../store/slices/authSlice';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { isAuthenticated, isLoading } = useSelector((state: RootState) => state.auth);
    console.log("isAuthentication, = ", isAuthenticated)

    // 쿠키에서 값을 가져오는 유틸리티 함수
    const getCookie = (name: string): string | null => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) {
            return parts.pop()?.split(';').shift() || null;
        }
        return null;
    };

    useEffect(() => {
        // 이미 인증된 상태가 아니라면 쿠키 확인
        const checkAuthFromCookies = async () => {
            if (!isAuthenticated && !isLoading) {
                const accessToken = getCookie('dayOnAccessToken');
                const refreshToken = getCookie('dayOnRefreshToken');

                if (accessToken && refreshToken) {
                    // 쿠키에 토큰이 있으면 인증 상태 설정

                    try {
                        await dispatch(setAuthFromCookies({
                            accessToken,
                            refreshToken
                        })).unwrap();

                        console.log('인증 성공');

                    } catch (error) {
                        console.error('쿠키에서 인증 정보 설정 실패:', error);
                        // 네비게이션으로 이동
                        navigate('/login', { replace: true });
                    }
                }
            }
        };

        checkAuthFromCookies();
    }, [isAuthenticated, isLoading, dispatch]);

    // 로딩 중일 때 로딩 스피너 표시
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">인증 확인 중...</p>
                </div>
            </div>
        );
    }

    // 인증되지 않았고 토큰도 없으면 로그인 페이지로 리디렉션
    if (!isAuthenticated) {
        const accessToken = getCookie('dayOnAccessToken');
        if (!accessToken) {
            return <Navigate to="/login" replace />;
        }
    }

    // 인증된 경우 자식 컴포넌트 렌더링
    return <>{children}</>;
};

export default ProtectedRoute;