import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  students: [],
  isLoading: true,
};
const studentsSlice = createSlice({
  name: "students",
  initialState,
  reducers: {
    setStudents: (state, action) => {
      state.students = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setStudents, setLoading } = studentsSlice.actions;

export default studentsSlice.reducer;
