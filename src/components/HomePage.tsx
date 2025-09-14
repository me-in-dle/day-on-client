// src/components/HomePage.tsx
import { RootState } from "@/store/store";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Calendar from "./Calendar";

export const HomePage: React.FC = () => {
    const account = useSelector((state: RootState) => state.auth.account);
    console.log("account = ", account);

    return (
        <div className="main-container">
            <div className="page-content">
                <div className="brand-section">
                    <h1 className="brand-title">DayOn</h1>
                    <p className="brand-subtitle">안녕하세요! {account?.nickName || "게스트"}님</p>
                    <div className="brand-description">
                        <p>오늘도 하루를 기록해보세요!</p>
                    </div>

                    {/* 캘린더 컴포넌트 */}
                    <div className="calendar-placeholder">
                        <Calendar />
                    </div>

                    {/* 오늘의 일정 카드 */}
                    <div className="calendar-placeholder">
                        <div className="calendar-component">
                            <p>{account?.nickName || "게스트"}님 오늘의 일정을 확인하세요.</p>
                        </div>
                    </div>

                    {/* 추천 활동 카드 */}
                    <div className="calendar-placeholder">
                        <div className="calendar-component">
                            <p>{account?.nickName || "게스트"}님 여가 시간에 이러한 활동은 어떤가요?</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};