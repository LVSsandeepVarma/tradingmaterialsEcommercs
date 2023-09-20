import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: "en",
  status: 'idle',
};



export const langSlice = createSlice({
  name: 'lang',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    userLanguage: (state, action) => {

      state.value = action.payload;
    }

  },


});
export const { userLanguage } = langSlice.actions;


export const lang = (state) => state.lang.value;


export default langSlice.reducer;
