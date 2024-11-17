import { configureStore } from '@reduxjs/toolkit'
import React from 'react'
import themeSliceReducer from './themeSlice';

export const store = configureStore({
    reducer: {
       themeKey: themeSliceReducer,
    },
});
