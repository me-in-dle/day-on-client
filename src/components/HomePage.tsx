// src/components/HomePage.tsx
import React, { useEffect, useState } from "react";
import { authAPI } from "../api/client";

export const HomePage: React.FC = () => {
    return (
        <div className="login-container">
            <div className="login-content">
                <div className="brand-section">
                    <h1 className="brand-title">DayOn</h1>
                    {/* <p className="brand-subtitle">환영합니다, {user?.name || '사용자'}님!</p> */}
                </div>
            </div>
        </div>
    );
};