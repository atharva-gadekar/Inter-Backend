import { Events } from "../models/Events.js";
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import sharp from "sharp";
import crypto from "crypto";
import path from "path";
import { Blog } from "../models/Blog.js";
import { Comment } from "../models/Comment.js";
import dotenv from "dotenv";
import { User } from "../models/User.js";

dotenv.config();
const bukcetName = process.env.BUCKET_NAME;
const region = process.env.BUCKET_REGION;
const accessKeyId = process.env.ACCESS_KEY;
const secretAccessKey = process.env.SECRET_ACCESS_KEY;

const s3 = new S3Client({
    credentials: {
        accessKeyId,
        secretAccessKey,
    },
    region
});

// Create a new event
export const createEvent = async (req, res) => {
    try {
        const {
            title,
            description,
            date,
            location,
        } = req.body;

        // Generate a random name for the image
        const randomImgName = (bytes = 16) =>
            crypto.randomBytes(bytes).toString("hex");
        const imgName = randomImgName();

        // Upload the image to S3
        const params = {
            Bucket: bukcetName,
            Key: imgName,
            Body: req.file.buffer,
            ContentType: req.file.mimetype,
        };
        const command = new PutObjectCommand(params);
        const result = await s3.send(command);

        // Create a new event document in the database
        const event = new Events({
            title,
            description,
            date,
            location,
            image: imgName,
        });
        await event.save();

        res.status(201).json({ event });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};

// Get all events
export const getAllEvents = async (req, res) => {
    try {
        const events = await Events.find();
        await Promise.all(events.map(async (event) => {
            const getObjectParams = {
                Bucket: bukcetName,
                Key: event.image,
            };
            const command = new GetObjectCommand(getObjectParams);
            const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
            event.url = url;
            return event;
        }));
        res.status(200).json({ events });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a specific event by id
export const getEvent = async (req, res) => {
    const id = req.params.eventId;
    try {
        const event = await Events.findById(id);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }
        const getObjectParams = {
            Bucket: bukcetName,
            Key: event.image,
        }
        const command = new GetObjectCommand(getObjectParams);
        const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
        event.url = url;
        res.status(200).json({ event });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update an event
export const updateEvent = async (req, res) => {
    const id = req.params.eventId;
    try {
        const event = await Events.findByIdAndUpdate(id, req.body, { new: true });
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }
        res.json(event);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete an event
export const deleteEvent = async (req, res) => {
    const id = req.params.eventId;
    try {
        const event = await Events.findByIdAndDelete(id);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }
        res.json({ message: "Event deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get upcoming events
export const getUpcomingEvents = async (req, res) => {
    try {
        const upcomingEvents = await Events.find({ date: { $gte: new Date() } });
        await Promise.all(upcomingEvents.map(async (event) => {
            const getObjectParams = {
                Bucket: bukcetName,
                Key: event.image,
            };
            const command = new GetObjectCommand(getObjectParams);
            const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
            event.url = url;
            return event;
        }));
        res.json(upcomingEvents);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get past events
export const getPastEvents = async (req, res) => {
    try {
        const pastEvents = await Events.find({ date: { $lt: new Date() } });
        await Promise.all(pastEvents.map(async (event) => {
            const getObjectParams = {
                Bucket: bukcetName,
                Key: event.image,
            };
            const command = new GetObjectCommand(getObjectParams);
            const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
            event.url = url;
            return event;
        }));
        res.json(pastEvents);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};





