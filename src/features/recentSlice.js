import { createSlice } from "@reduxjs/toolkit";

function getRecent() {
  if (!sessionStorage.getItem("recent")) {
    return [];
  } else {
    return JSON.parse(sessionStorage.getItem("recent"));
  }
}

const recent = getRecent();

export const recentSlice = createSlice({
  name: "recent",
  initialState: {
    value: recent,
    volume: 50,
  },
  reducers: {
    updaterec: (state, action) => {
      const index = state.value.findIndex(item => item.id === action.payload.id);
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes.
      // Also, no return statement is required from these functions.
      if (index !== -1) {
        state.value = [action.payload, ...state.value.filter((_, i) => i !== index)];
        state.value = state.value.slice(0, 10);
        sessionStorage.setItem("recent", JSON.stringify(state.value));
      } else {
        state.value = [action.payload, ...state.value];
        state.value = state.value.slice(0, 10);
        sessionStorage.setItem("recent", JSON.stringify(state.value));
      }
    },
    updatevol:(state, action)=>{
      state.volume = action.payload
    }
  },
});

// Action creators are generated for each case reducer function
export const { updaterec, updatevol } = recentSlice.actions;

export default recentSlice.reducer;
