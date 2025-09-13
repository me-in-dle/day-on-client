import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { authAPI } from '@/api/client';
import { initialState } from '../types';


const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        setAuthenticated(state, action: PayloadAction<boolean>) {
            state.isAuthenticated = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(googleLogin.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(googleLogin.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = true;
                state.account = action.payload.account;
                localStorage.setItem('accessToken', action.payload.accessToken);
            })
            .addCase(googleLogin.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Google login failed';
            })
            .addCase(kakaoLogin.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(kakaoLogin.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = true;
                state.account = action.payload.account;
                localStorage.setItem('accessToken', action.payload.accessToken);
            })
            .addCase(kakaoLogin.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Kakao login failed';
            })
            .addCase(logout.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(logout.fulfilled, (state) => {
                state.isLoading = false;
                state.isAuthenticated = false;
                state.account = null;
            })
            .addCase(logout.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Logout failed';
            });
    }
});

export const googleLogin = createAsyncThunk(
    'auth/googleLogin',
    async (code: string) => {
        const response = await authAPI.googleLogin(code);
        return response.data;
    }
);

export const kakaoLogin = createAsyncThunk(
    'auth/kakaoLogin',
    async (code: string) => {
        const response = await authAPI.kakaoLogin(code);
        return response.data;
    }
);

export const logout = createAsyncThunk(
    'auth/logout',
    async () => {
        await authAPI.logout();
        localStorage.removeItem('accessToken');
    }
);

export const { clearError, setAuthenticated } = authSlice.actions;
export default authSlice.reducer;