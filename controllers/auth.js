import mongoose from "mongoose";
import {User} from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
    let { name, email, password, picture, collegeName, year, branch, interests } = req.body;
    try {
        const salt = await bcrypt.genSalt(10);
        password = await bcrypt.hash(password, salt);
        const user = await User.create({
					name,
					email,
					password,
					picture,
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
    let { email, password } = req.body;
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
        const isMatch = await bcrypt.compare(
					password,
					user.password,
				);
        
        if(!isMatch){
            return res.status(404).json({ error: "Invalid Credentials" });
        }
        
        const jwt_token = jwt.sign({ id : user._id }, 
        process.env.JWT_SECRET_KEY, {
            expiresIn: 86400
        });
        delete user.password;
        res.status(200).json({ jwt_token });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}
