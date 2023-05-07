// Ticket Controller functions

const asyncHandler = require("express-async-handler");

// import Models
const Ticket = require("../models/ticketModel");
const User = require("../models/userModel");

//    Get user tickets
//route   GET /api/tickets
//access  Private
const getTickets = asyncHandler(async (req, res) => {
  // Get user in the User model, using the id in the JWT
  const user = await User.findById(req.user.id);

  //check if user is returned
  if (!user) {
    res.status(401);
    throw new Error("User not found");
  }

  const tickets = await Ticket.find({ user: req.user.id });

  res.status(200).json(tickets);
});

//   Create user tickets
//route   POST /api/tickets
//access  Private
const createTicket = asyncHandler(async (req, res) => {
  //
  const { product, description } = req.body;

  const user = await User.findById(req.user.id);
  //Check if user exists
  if (!user) {
    res.status(401);
    throw new Error("User not found");
  }

  if (!product || !description) {
    res.status(400);
    throw new Error("Please fill all data");
  }

  const ticket = await Ticket.create({
    user,
    product,
    description,
  });

  //If ticket is created
  if (ticket) {
    res.status(201).json({
      message: "Ticket created !",
      user: ticket.user.name,
      product: ticket.product,
      description: ticket.description,
      id: ticket.id,
      status: ticket.status,
    });
  }
});

//   Get user ticket
//route   GET /api/tickets/:id
//access  Private
const getTicket = asyncHandler(async (req, res) => {
  // Get user in the User model, using the ID in the JWT
  const user = await User.findById(req.user.id);

  //Check if user is returned
  if (!user) {
    res.status(401);
    throw new Error("User not found");
  }

  const ticket = await Ticket.findById(req.params.id);

  if (!ticket) {
    res.status(404);
    throw new Error("Ticket not found");
  }

  if (ticket.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("Not Authorized.");
  }

  res.status(200).json(ticket);
});

//   Delete ticket
//route   Delete /api/tickets/:id
//access  Private
const deleteTicket = asyncHandler(async (req, res) => {
  // Get user in the User model, using the id in the JWT
  const user = await User.findById(req.user.id);

  //Check if user is returned
  if (!user) {
    res.status(401);
    throw new Error("User not found");
  }

  const ticket = await Ticket.findById(req.params.id);

  if (!ticket) {
    res.status(404);
    throw new Error("Ticket not found");
  }

  if (ticket.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("Not Authorized.");
  }

  await ticket.remove();

  res.status(200).json({ message: "Ticket Deleted" });
});

//    Update ticket
//route   PUT /api/tickets/:id
//access  Private
const updateTicket = asyncHandler(async (req, res) => {
  // Get user in the User model, using the id in the JWT
  const user = await User.findById(req.user.id);

  //Check if user is returned
  if (!user) {
    res.status(401);
    throw new Error("User not found");
  }

  const ticket = await Ticket.findById(req.params.id);

  if (!ticket) {
    res.status(404);
    throw new Error("Ticket not found");
  }

  if (ticket.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("Not Authorized.");
  }

  const updatedTicket = await Ticket.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true } //if ticket doesn't exist, create it
  );

  res.status(200).json({ message: "Ticket Updated !", updatedTicket });
});

module.exports = {
  getTickets,
  createTicket,
  getTicket,
  deleteTicket,
  updateTicket,
};
