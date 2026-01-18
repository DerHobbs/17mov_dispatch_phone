import { type PayloadAction, createSlice } from '@reduxjs/toolkit';
import type { RootState } from '.';

export interface AppType {
    resourceName: string;
    toPage: string | -1 | null; // Don't change value of this variable
    clicked: number;
}

const initialState: AppType = {
    resourceName: '',
    toPage: null,
    clicked: 0,
};

const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        updateApp: {
            reducer<K extends keyof AppType>(state: AppType, action: PayloadAction<{ key: K; value: AppType[K] }>) {
                const { key, value } = action.payload;
                state[key] = value;
            },
            prepare<K extends keyof AppType>(key: K, value: AppType[K]) {
                return { payload: { key, value } };
            },
        },
    },
});

export const { updateApp } = appSlice.actions;
export const appStore = (state: RootState) => state.app;
export default appSlice.reducer;
