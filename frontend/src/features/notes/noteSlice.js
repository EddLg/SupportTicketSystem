import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import noteService from "./noteService";

const initialState = {
  notes: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

// Get Ticket Notes
export const getNotes = createAsyncThunk(
  "notes/getAll",
  async (ticketId, thunkAPI) => {
    try {
      //Get the user token from local storage
      const token = thunkAPI.getState().auth.user.token;

      const ticket = await noteService.getNotes(ticketId, token);

      return ticket;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();

      return thunkAPI.rejectWithValue(message); // * goes to the Rejected Case as action payload
    }
  }
);

// Create Ticket Note
export const createNote = createAsyncThunk(
  "note/create",
  async ({ noteText, ticketId }, thunkAPI) => {
    try {
      //Get the user token from local storage
      const token = thunkAPI.getState().auth.user.token;

      const ticket = await noteService.createNote(noteText, ticketId, token);

      return ticket;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();

      return thunkAPI.rejectWithValue(message); // * goes to the Rejected Case as action payload
    }
  }
);

export const noteSlice = createSlice({
  name: "note",
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Get Tickets Notes
      .addCase(getNotes.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getNotes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.notes = action.payload;
      })
      .addCase(getNotes.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Create Note
      .addCase(createNote.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createNote.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        // add right into the UI without reload
        state.notes.push(action.payload);
      })
      .addCase(createNote.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = noteSlice.actions;

// this is imported in the store.js
export default noteSlice.reducer;
