import { configureStore } from '@reduxjs/toolkit';
import loaderReducer from '../features/loader/loaderSlice';
import productsReducer from "../features/products/productsSlice"

export const store = configureStore({
  reducer: {
    loader: loaderReducer,
    products : productsReducer
  },
});
