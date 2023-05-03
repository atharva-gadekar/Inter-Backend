import express from "express";
const router = express.Router();

import {
    getAllEvents,
    getEvent,
    updateEvent,
    deleteEvent,
    getUpcomingEvents,
    getPastEvents
} from "../controllers/events.js";

// Routes for Events
router.get("/", getAllEvents);
router.get("/:eventId", getEvent);
router.patch("/:eventId", updateEvent);
router.delete("/:eventId", deleteEvent);
router.get("/upcoming", getUpcomingEvents);
router.get("/past", getPastEvents);

export default router;
