import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: {
    type: "",
    message: ""
  },
  status: 'idle',
};


export const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    updateNotifications : (state, action)  =>{
        console.log(action.payload)
        state.value = action?.payload
    }
  },
});

export const { updateNotifications } = notificationSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const notifications = (state) => state.notification.value;


export default notificationSlice.reducer;
