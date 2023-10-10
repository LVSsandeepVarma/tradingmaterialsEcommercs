import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: {
    showSignupModal: false,
    showLoginModal: false,
    showforgotPasswordModal: false,
    showOtpModal: false,
    showNewPasswordModal: false,
    showSignupCartModal: false,
    showSignupBuyModal: false
  },
  status: "idle",
};

export const signupinModalSlice = createSlice({
  name: "signupinModal",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    usersignupinModal: (state, action) => {
      state.value = action.payload;
    },
  },
});
export const { usersignupinModal } = signupinModalSlice.actions;

export const signupinModal = (state) => state.signupinModal.value;

export default signupinModalSlice.reducer;
