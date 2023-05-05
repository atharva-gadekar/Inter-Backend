import mongoose from "mongoose";
const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    eventUrl: {
        type: String,
        required: false,
    },
    url: {
        type: String,
        required: false,
    }

});
export const Events = mongoose.model('Events', eventSchema);