import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: {
    cartTop: "",
    cartRight:"",
    productTop: "",
    productRight: ""
  },
  status: 'idle',
};


export const positionSlice = createSlice({
  name: 'position',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    updatePositions : (state, action)  =>{
        state.value = action?.payload
    }
  },
});

export const { updatePositions } = positionSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const positions = (state) => state.position.value;


export default positionSlice.reducer;
