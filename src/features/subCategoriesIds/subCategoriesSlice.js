import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: {},
  status: 'idle',
};



export const subIdSlice = createSlice({
  name: 'subId',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    productsSubId: (state, action) => {

      state.value = action.payload;
    }

  },


});
export const { productsSubId } = subIdSlice.actions;


export const subId = (state) => state.subId.value;


export default subIdSlice.reducer;
