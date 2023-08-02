import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { act } from 'react-dom/test-utils';

const initialState = {
  value: {
    cartCount : 0,
    wishLishCount: 0
  },
  status: 'idle',
};


export const savedSlice = createSlice({
  name: 'saved',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    updateCartCount : (state, action)  =>{
        state.value.cartCount = action?.payload
    },
    updateWishListCount : (state, action) =>{
        state.value.wishLishCount = action.payload
    }
  },
});

export const { updatesaveds } = savedSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const saved = (state) => state.saved.value;


export default savedSlice.reducer;
