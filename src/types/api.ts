export interface Account {
    nickName: string;
    age?: number;
}

export interface AuthState {
    isAuthenticated: boolean;
    isLoading: boolean;
    account: Account | null;
    accessToken: string | null;
    refreshToken: string | null;
    error: string | null;
}

export interface LoginResponse {
    accessToken: string;
    refreshToken?: string;
    account: Account;
}

// 쿠키에서 가져온 토큰 정보
export interface TokenInfo {
    accessToken: string;
    refreshToken: string;
}

// API 응답 기본 구조
export interface ApiResponse<T> {
    success: boolean;
    errorCode?: string;
    message?: string;
    data: T;
}