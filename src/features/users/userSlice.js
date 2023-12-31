import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: {},
  status: 'idle',
};


export const userSlice = createSlice({
  name: 'user',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    updateUsers : (state, action)  =>{
        console.log(action.payload)
        state.value = action?.payload
    }
  },
});

export const { updateUsers } = userSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const users = (state) => state.user.value;


export default userSlice.reducer;
