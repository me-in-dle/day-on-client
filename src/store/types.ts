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

export const initialState: AuthState = {
    account: null,
    isAuthenticated: false,
    isLoading: false,
    accessToken: null,
    refreshToken: null,
    error: null,
};

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