// Ticket Routes

// Routes + controller functions
// Node Express

const express = require("express");
const router = express.Router();
const {
  getTickets,
  createTicket,
  getTicket,
  deleteTicket,
  updateTicket,
} = require("../controllers/ticketController");

//Add protect middleware
const { protect } = require("../middleware/authMiddleware");

// Re-Route into  Note Router
const noteRouter = require("./noteRoutes");
router.use("/:ticketId/notes", noteRouter);

// main route = api/tickets

//alternate syntax
router.route("/").get(protect, getTickets).post(protect, createTicket);

router.get("/:id", protect, getTicket);
router.delete("/:id", protect, deleteTicket);
router.put("/:id", protect, updateTicket);

module.exports = router;
