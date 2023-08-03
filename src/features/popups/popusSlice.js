import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: false,
  status: 'idle',
};


export const popupSlice = createSlice({
  name: 'popup',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    showPopup : (state)  =>{

        state.value = true
    },
    hidePopup: (state) =>{
        state.value = false
    } 
  },
});

export const { showPopup, hidePopup } = popupSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const popups = (state) => state.popup.value;


export default popupSlice.reducer;
