import mongoose from "mongoose";
import { User } from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import sharp from "sharp";
import crypto from "crypto";
import path from "path";
import dotenv from "dotenv";
import cookie from "cookie-parser";

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


export const register = async (req, res) => {
    let { name, email, password, collegeName, year, branch, interests } = req.body;
    try {
        var buffer = req.file.buffer;
        console.log(req.file.mimetype);
        const randomImgName = (bytes = 16) => crypto.randomBytes(bytes).toString("hex");
        const imgName = randomImgName();
        const params = {
            Bucket: bukcetName,
            Key: imgName,
            Body: buffer,
            ContentType: req.file.mimetype,
        };

        const command = new PutObjectCommand(params);
        const result = await s3.send(command);
        const salt = await bcrypt.genSalt(10);
        password = await bcrypt.hash(password, salt);
        const user = await User.create({
            name,
            email,
            password,
            picture: params.Key,
            collegeName,
            year,
            branch,
            interests,
        });
        res.status(201).json({ user });
    } catch (error) {
        res.status(400).json({ error: error.message, });
    }
}

export const login = async (req, res) => {
    let { email, password, rememberMe } = req.body;
    try {
        if (!email || !password) {
            return res
                .status(400)
                .json({ error: "Please provide email and password" });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "Invalid Credentials" });
        }
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(404).json({ error: "Invalid Credentials" });
        }

        const expiresIn = rememberMe ? "7d" : "24h"; // Set token expiration
        const jwt_token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
            expiresIn,
        });
        const id = user._id;
        delete user.password;
        res.status(200).cookie("jwt_token", jwt_token, {
            httpOnly: true,
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Set cookie expiration
        }).json({ id, jwt_token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
