// Ticket Slice

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import ticketService from "./ticketService";

// 1. Initial state
const initialState = {
  tickets: [],
  ticket: {},
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

// 2. functions
// Create new ticket
export const createTicket = createAsyncThunk(
  // Slice name / method
  "tickets/create",
  async (ticketData, thunkAPI) => {
    try {
      //get the user token from local storage
      const token = thunkAPI.getState().auth.user.token;

      return await ticketService.createTicket(ticketData, token);
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

// Get User Tickets
export const getTickets = createAsyncThunk(
  "tickets/getAll",
  // _ = because no need for data
  async (_, thunkAPI) => {
    try {
      //get the user token from local storage
      const token = thunkAPI.getState().auth.user.token;

      const tickets = await ticketService.getTickets(token);

      return tickets;
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

// Get User Ticket
export const getTicket = createAsyncThunk(
  "tickets/get",
  async (ticketId, thunkAPI) => {
    try {
      //get the user token from local storage
      const token = thunkAPI.getState().auth.user.token;

      const ticket = await ticketService.getTicket(ticketId, token);

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

// Close Status
export const closeTicket = createAsyncThunk(
  "tickets/close",
  async (ticketId, thunkAPI) => {
    try {
      //get the user token from local storage
      const token = thunkAPI.getState().auth.user.token;

      const ticket = await ticketService.closeTicket(ticketId, token);

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

// 3. Create Slice
// export slice
export const ticketSlice = createSlice({
  name: "ticket",
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Create Ticket
      .addCase(createTicket.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createTicket.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(createTicket.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload; // from *
      })
      // Get User Tickets
      .addCase(getTickets.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getTickets.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.tickets = action.payload;
      })
      .addCase(getTickets.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Get Single Ticket
      .addCase(getTicket.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.ticket = action.payload;
      })
      .addCase(getTicket.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getTicket.rejected, (state, action) => {
        state.isError = true;
        state.isLoading = false;
        state.message = action.payload;
      })
      // Close Ticket
      .addCase(closeTicket.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tickets.map((ticket) =>
          ticket._id === action.payload._id
            ? (ticket.status = "closed")
            : ticket
        );
      });
  },
});

// export the reset action
export const { reset } = ticketSlice.actions;

// 4. Export the Slice, that needs to be added to the store
export default ticketSlice.reducer;
