import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: false,
  status: 'idle',
};

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched. Thunks are
// typically used to make async requests.


export const loaderSlice = createSlice({
  name: 'loader',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    showLoader: (state) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.value = true;
    },
    hideLoader: (state) => {
      state.value = false;
    },

  },
  // The `extraReducers` field lets the slice handle actions defined elsewhere,
  // including actions generated by createAsyncThunk or in other slices.

});

export const { showLoader, hideLoader } = loaderSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const loader = (state) => state.loader.value;


export default loaderSlice.reducer;
