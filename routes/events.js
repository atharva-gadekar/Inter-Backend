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
router.get("/upcoming", getUpcomingEvents);
router.get("/past", getPastEvents);
router.get("/:eventId", getEvent);
router.patch("/:eventId", updateEvent);
router.delete("/:eventId", deleteEvent);


export default router;
