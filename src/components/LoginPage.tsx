// src/components/LoginPage.tsx
import React, { useState, useEffect } from 'react';
import { GoogleIcon } from './icon/GoogleIcon';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { authAPI } from '@/api/client';
import { KakaoIcon } from './icon/KaKaoIcon';

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const { isAuthenticated, isLoading } = useSelector((state: RootState) => state.auth);

    // 이미 로그인된 경우 대시보드로 리디렉션
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard', { replace: true });
        }
    }, [isAuthenticated, navigate]);

    const handleGoogleLogin = () => {
        authAPI.redirectToGoogleLogin();
    };

    const handleKakaoLogin = () => {
        authAPI.redirectToKakaoLogin();
    };

    return (
        <div className="main-container">
            <div className="login-content">
                {/* 브랜드 섹션 */}
                <div className="brand-section">
                    <h1 className="brand-title">DayOn</h1>
                    <p className="brand-subtitle">오늘을 쓰다</p>
                    <div className="brand-description">
                        <p>당신의 하루를 기록하고</p>
                        <p>소중한 순간들을 남겨보세요</p>
                    </div>
                </div>

                {/* 로그인 섹션 */}
                <div className="login-section">
                    <h2 className="login-title">시작하기</h2>
                    <p className="login-subtitle">소셜 계정으로 간편하게 로그인하세요</p>

                    {/* 로그인 버튼들 */}
                    <div className="login-buttons">
                        <button
                            className="btn google"
                            onClick={handleGoogleLogin}
                            disabled={isLoading}
                        >
                            <GoogleIcon />
                            Google로 계속하기
                        </button>

                        <button
                            className="btn kakao"
                            onClick={handleKakaoLogin}
                            disabled={isLoading}
                        >
                            <KakaoIcon />
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

export default LoginPage;