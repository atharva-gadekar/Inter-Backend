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
import nodemailer from "nodemailer";
dotenv.config();

// const DOMAIN = 'sandbox4a3f6d145f8e46d3bb0e3dc3773e3159.mailgun.org';
// const mg = mailgun({ apiKey: process.env.MAILGUN_APIKEY, domain: DOMAIN });

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
    let { name, email, password, collegeName, year, branch, title, about, username } = req.body;
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
            title,
            username,
            about
        });
        res.status(201).json({ user });
    } catch (error) {
        console.log(error);
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
        var newUser = false;
        if(user.interests.length===0) newUser = true;
        delete user.password;
        res.status(200).cookie("jwt_token", jwt_token, {
            httpOnly: true,
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Set cookie expiration
        }).json({ id, jwt_token, newUser });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }

};



const transporter = nodemailer.createTransport({
    host: 'smtp-relay.sendinblue.com',
    port: 587,
    auth: {
        user: 'nightthrasher10@gmail.com',
        pass: 'GR43tC95dyPzgL7m'
    }
});

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "user with this email does not exist" });
        } else {
            const token = jwt.sign({ _id: user._id, email, password: user.password }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
            const mailOptions = {
                from: 'noreply@hello.com',
                to: email,
                subject: 'Password Reset Link',
                html: `
                    <h2>Please click on given link to reset your password</h2>
                    <p>${process.env.CLIENT_URL}/${token}</p>
                `
            };
            await user.updateOne({ resetLink: token });
            await transporter.sendMail(mailOptions);
            return res.json({ message: 'Email has been sent, kindly reset your password' });
        }
    } catch (err) {
        console.log(err);
        return res.status(400).json({ error: "reset password error" });
    }
}

export const resetPassword = async (req, res) => {
    try {
        let { resetLink, newPassword } = req.body;

        if (!resetLink) {
            return res.status(400).json({ error: "Reset link is required" });
        }

        jwt.verify(resetLink, process.env.JWT_SECRET_KEY, async (err, decodedData) => {
            if (err) {
                console.log(err);
                return res.status(401).json({ error: "Incorrect or expired token. Please request a new password reset." });
            }

            const user = await User.findOne({ _id: decodedData._id, resetLink });

            if (!user) {
                return res.status(400).json({ error: "User with this token does not exist" });
            }

            const salt = await bcrypt.genSalt(10);
            newPassword = await bcrypt.hash(newPassword, salt);



            user.password = newPassword;
            user.resetLink = "";

            await user.save();

            return res.status(200).json({ message: "Your password has been successfully updated" });
        });
    } catch (err) {
        console.log(err);
        return res.status(400).json({ error: "Reset password error" });
    }
};




