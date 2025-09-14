import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { authAPI } from '@/api/client';
import { initialState, TokenInfo, Account } from '../types';

// 쿠키에서 토큰을 가져와서 사용자 정보를 조회하는 thunk
export const setAuthFromCookies = createAsyncThunk(
    'auth/setAuthFromCookies',
    async (tokens: TokenInfo, { rejectWithValue }) => {
        try {
            // 토큰을 먼저 설정 (API 호출에 필요)
            const { accessToken, refreshToken } = tokens;

            console.log("accessToken = ", accessToken);
            console.log("refreshToken = ", refreshToken);

            // 사용자 정보 조회
            const userResponse = await authAPI.getUserInfo();

            if (userResponse.status !== 200) {
                return rejectWithValue({
                    message: '사용자 정보 조회에 실패했습니다.',
                    shouldRedirect: true
                });
            }

            return {
                accessToken,
                refreshToken,
                account: userResponse.data
            };
        } catch (error) {
            console.log("error = ", error);
            return rejectWithValue({
                message: '인증 실패',
                shouldRedirect: true
            });
        }
    }
);

// 로그아웃 thunk - 쿠키 삭제 포함
export const logout = createAsyncThunk(
    'auth/logout',
    async () => {
        try {
            await authAPI.logout();
        } catch (error) {
            // API 호출이 실패해도 클라이언트에서는 로그아웃 처리
            console.warn('로그아웃 API 호출 실패:', error);
        } finally {
            // 쿠키 삭제
            document.cookie = 'dayOnAccessToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Strict';
            document.cookie = 'dayOnRefreshToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Strict';
        }
    }
);

// 토큰 갱신 thunk
export const refreshToken = createAsyncThunk(
    'auth/refreshToken',
    async (_, { getState, rejectWithValue }) => {
        try {
            const state = getState() as { auth: typeof initialState };
            const currentRefreshToken = state.auth.refreshToken;

            if (!currentRefreshToken) {
                throw new Error('Refresh token이 없습니다.');
            }

            const response = await authAPI.refreshToken(currentRefreshToken);
            return response.data;
        } catch (error) {
            return rejectWithValue('토큰 갱신에 실패했습니다.');
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        setAuthenticated: (state, action: PayloadAction<boolean>) => {
            state.isAuthenticated = action.payload;
        },
        clearAuth: (state) => {
            state.isAuthenticated = false;
            state.account = null;
            state.accessToken = null;
            state.refreshToken = null;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // 쿠키에서 인증 정보 설정
            .addCase(setAuthFromCookies.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(setAuthFromCookies.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = true;
                state.account = action.payload.account;
                state.accessToken = action.payload.accessToken;
                state.refreshToken = action.payload.refreshToken;
            })
            .addCase(setAuthFromCookies.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || '인증 정보 설정에 실패했습니다.';
            })
            // 로그아웃
            .addCase(logout.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(logout.fulfilled, (state) => {
                state.isLoading = false;
                state.isAuthenticated = false;
                state.account = null;
                state.accessToken = null;
                state.refreshToken = null;
            })
            .addCase(logout.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || '로그아웃에 실패했습니다.';
                // 로그아웃 실패해도 클라이언트에서는 로그아웃 상태로 변경
                state.isAuthenticated = false;
                state.account = null;
                state.accessToken = null;
                state.refreshToken = null;
            })
            // 토큰 갱신
            .addCase(refreshToken.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(refreshToken.fulfilled, (state, action) => {
                state.isLoading = false;
                state.accessToken = action.payload.accessToken;
                if (action.payload.refreshToken) {
                    state.refreshToken = action.payload.refreshToken;
                }
            })
            .addCase(refreshToken.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
                // 토큰 갱신 실패시 로그아웃 처리
                state.isAuthenticated = false;
                state.account = null;
                state.accessToken = null;
                state.refreshToken = null;
            });
    }
});

export const { clearError, setAuthenticated, clearAuth } = authSlice.actions;
export default authSlice.reducer;