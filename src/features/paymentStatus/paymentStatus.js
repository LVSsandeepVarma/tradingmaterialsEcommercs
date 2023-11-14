import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: false,
  status: "idle",
};

export const paymentSlice = createSlice({
  name: "payment",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    showpayment: (state) => {
      state.value = true;
    },
    hidepayment: (state) => {
      state.value = false;
    },
  },
});

export const { showpayment, hidepayment } = paymentSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const payments = (state) => state.payment.value;

export default paymentSlice.reducer;
