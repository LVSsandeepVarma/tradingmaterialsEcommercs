import { configureStore } from '@reduxjs/toolkit';
import loaderReducer from '../features/loader/loaderSlice';
import productsReducer from "../features/products/productsSlice"
import loginReducer from '../features/login/loginSlice';
import positionReducer from '../features/positions/positionsSlice';
import savedReducer from '../features/cartWish/focusedCount';
import userReducer from '../features/users/userSlice';
import notificationRefucer from '../features/notifications/notificationSlice';
import cartReducer from '../features/cartItems/cartSlice';
import popupReducer from '../features/popups/popusSlice';
import langReducer  from '../features/userLang/userLang';
import clientTypeReducer from '../features/clientType/clientType';
import addressReducer from '../features/address/addressSlice';
import subIdReducer from '../features/subCategoriesIds/subCategoriesSlice';
import signupinModalReducer from '../features/signupinModals/signupinSlice';
import paymentSliceReduces from "../features/paymentStatus/paymentStatus"

export const store = configureStore({
  reducer: {
    loader: loaderReducer,
    products : productsReducer,
    login : loginReducer,
    position : positionReducer,
    saved: savedReducer,
    user: userReducer,
    notification: notificationRefucer,
    cart: cartReducer,
    popup: popupReducer,
    lang: langReducer,
    clientType : clientTypeReducer,
    addressStatus: addressReducer,
    subId: subIdReducer,
    signupInModal: signupinModalReducer,
    paymentStatus: paymentSliceReduces
  },
});
