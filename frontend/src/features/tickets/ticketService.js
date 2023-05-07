// Ticket Service
// Ticket Slice API interaction services

import axios from "axios";

const API_URL = "/api/tickets/";

// get User tickets
const getTickets = async (token) => {
  //
  // Token has to be in the headers, in the Authorization field
  //
  // String of "Bearer + Token"
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(API_URL, config);

  return response.data;
};
// Create New ticket
const createTicket = async (ticketData, token) => {
  // Token has to be in the headers, in the Authorization field
  //
  // String of "Bearer + Token"
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(API_URL, ticketData, config);

  return response.data;
};

// Get Single Ticket
const getTicket = async (ticketId, token) => {
  //

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(API_URL + ticketId, config);

  return response.data;
};

// Close Ticket
const closeTicket = async (ticketId, token) => {
  //

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.put(
    API_URL + ticketId,
    { status: "closed" },
    config
  );

  return response.data;
};

const ticketService = {
  createTicket,
  getTickets,
  getTicket,
  closeTicket,
};

export default ticketService;
