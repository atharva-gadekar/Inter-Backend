import mongoose from "mongoose";

const interestSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    relatedTags: [String]
});

export const Interests = mongoose.model('Interests', interestSchema);

