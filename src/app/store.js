import { configureStore } from '@reduxjs/toolkit';
import loaderReducer from '../features/loader/loaderSlice';
import productsReducer from "../features/products/productsSlice"
import loginReducer from '../features/login/loginSlice';
import positionReducer from '../features/positions/positionsSlice';
import savedReducer from '../features/cartWish/focusedCount';
import userReducer from '../features/users/userSlice';

export const store = configureStore({
  reducer: {
    loader: loaderReducer,
    products : productsReducer,
    login : loginReducer,
    position : positionReducer,
    saved: savedReducer,
    user: userReducer
  },
});
