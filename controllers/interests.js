import { Interests } from "../models/Interests.js";
export const interest = async (req, res) => {
    const interests = await Interests.find({});
    res.json(interests);
};

export const subInterest = async (req, res) => {
    const interest = await Interests.findOne({ name: req.params.interestName });
    const relatedTags = interest.relatedTags;
    res.json(relatedTags);
};