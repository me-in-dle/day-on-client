export interface Account {
    id: number;
    nickname: string;
}

export interface AuthState {
    isAuthenticated: boolean;
    isLoading: boolean;
    account: Account | null;
    error: string | null,
}

export const initialState: AuthState = {
    account: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
};

export interface LoginResponse {
    accessToken: string;
    refreshToken?: string;
    account: Account;
}