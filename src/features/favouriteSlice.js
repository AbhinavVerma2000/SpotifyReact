import { createSlice } from "@reduxjs/toolkit";

function getFav() {
  if (!sessionStorage.getItem("favourite")) {
    return [];
  } else {
    return JSON.parse(sessionStorage.getItem("favourite"));
  }
}
const fav = getFav();

export const favouriteSlice = createSlice({
  name: "favourite",
  initialState: {
    value: fav,
  },
  reducers: {
    updatefav: (state, action) => {
      const index = state.value.findIndex(item => item.id === action.payload.id);
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes.
      // Also, no return statement is required from these functions.
      if (index !== -1) {
        state.value = [...state.value.filter((_, i) => i !== index)];
        sessionStorage.setItem("favourite", JSON.stringify(state.value));
      } else {
        state.value = [action.payload, ...state.value];
        sessionStorage.setItem("favourite", JSON.stringify(state.value));
      }
    },
  },
});

// Action creators are generated for each case reducer function
export const { updatefav } = favouriteSlice.actions;

export default favouriteSlice.reducer;
