// src/components/LoginPage.tsx
import React, { useState } from 'react';
// 상대 경로로 명확하게 지정
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { googleLogin, kakaoLogin, clearError } from '../store/slices/authSlice';

// 디버깅을 위한 로그
console.log('LoginPage.tsx loaded');
console.log('useAppDispatch:', useAppDispatch);
console.log('useAppSelector:', useAppSelector);

const LoginPage: React.FC = () => {
    const dispatch = useAppDispatch();
    const { isLoading, error } = useAppSelector((state) => state.auth);
    const [loadingType, setLoadingType] = useState<'google' | 'kakao' | null>(null);

    const handleGoogleLogin = async () => {
        try {
            setLoadingType('google');
            // 실제 구현에서는 Google OAuth 플로우를 통해 인증 코드를 받아야 합니다
            // 여기서는 데모용으로 임시 코드를 사용
            const authCode = 'demo-google-auth-code';
            await dispatch(googleLogin(authCode)).unwrap();
        } catch (error) {
            console.error('Google login failed:', error);
        } finally {
            setLoadingType(null);
        }
    };

    const handleKakaoLogin = async () => {
        try {
            setLoadingType('kakao');
            // 실제 구현에서는 Kakao OAuth 플로우를 통해 인증 코드를 받아야 합니다
            // 여기서는 데모용으로 임시 코드를 사용
            const authCode = 'demo-kakao-auth-code';
            await dispatch(kakaoLogin(authCode)).unwrap();
        } catch (error) {
            console.error('Kakao login failed:', error);
        } finally {
            setLoadingType(null);
        }
    };

    const handleClearError = () => {
        dispatch(clearError());
    };

    return (
        <div className="login-container">
            <div className="login-content">
                {/* 메인 타이틀 */}
                <div className="brand-section neuro-card">
                    <h1 className="brand-title">DayOn</h1>
                    <p className="brand-subtitle">오늘을 쓰다</p>
                    <div className="brand-description">
                        <p>당신의 하루를 기록하고</p>
                        <p>소중한 순간들을 남겨보세요</p>
                    </div>
                </div>

                {/* 로그인 섹션 */}
                <div className="login-section neuro-card">
                    <h2 className="login-title">시작하기</h2>
                    <p className="login-subtitle">소셜 계정으로 간편하게 로그인하세요</p>

                    {/* 에러 메시지 */}
                    {error && (
                        <div className="error-message" onClick={handleClearError}>
                            {error}
                            <span className="error-close">✕</span>
                        </div>
                    )}

                    {/* 로그인 버튼들 */}
                    <div className="login-buttons">
                        <button
                            className="neuro-btn google"
                            onClick={handleGoogleLogin}
                            disabled={isLoading}
                        >
                            {loadingType === 'google' ? (
                                <div className="loading-spinner" />
                            ) : (
                                <GoogleIcon />
                            )}
                            Google로 계속하기
                        </button>

                        <button
                            className="neuro-btn kakao"
                            onClick={handleKakaoLogin}
                            disabled={isLoading}
                        >
                            {loadingType === 'kakao' ? (
                                <div className="loading-spinner" />
                            ) : (
                                <KakaoIcon />
                            )}
                            카카오로 계속하기
                        </button>
                    </div>

                    <div className="login-footer">
                        <p>로그인하면 서비스 이용약관과 개인정보처리방침에 동의하게 됩니다.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

// 구글 아이콘 컴포넌트
const GoogleIcon: React.FC = () => (
    <svg width="20" height="20" viewBox="0 0 24 24">
        <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        />
        <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        />
    </svg>
);

// 카카오 아이콘 컴포넌트
const KakaoIcon: React.FC = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="#3c1e1e">
        <path d="M12 3C7.03 3 3 6.44 3 10.61c0 2.67 1.73 5.02 4.38 6.39-.18-.64-.33-1.64-.09-2.36l1.78-7.53s-.46-.92-.46-2.28c0-2.14 1.24-3.74 2.78-3.74 1.31 0 1.95.99 1.95 2.17 0 1.32-.84 3.3-1.27 5.12-.36 1.53.77 2.77 2.28 2.77 2.74 0 4.84-2.88 4.84-7.04 0-3.68-2.65-6.26-6.43-6.26-4.38 0-6.95 3.28-6.95 6.67 0 1.32.51 2.73 1.14 3.5.13.15.14.29.11.44-.12.5-.38 1.54-.44 1.75-.07.28-.23.34-.53.21C4.88 15.2 3.84 13.04 3.84 10.61 3.84 6.44 7.03 3 12 3z" />
    </svg>
);

export default LoginPage;