import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: {},
  status: 'idle',
};

export const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    fetchAllProducts: (state,action) => {
        console.log(action.payload)

      state.value = action.payload 
    },

  },


});

export const { fetchAllProducts } = productsSlice.actions;


export const products = (state) => state.products.value;


export default productsSlice.reducer;
