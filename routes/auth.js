import express from "express";
const router = express.Router();

import { login, forgotPassword, resetPassword } from "../controllers/auth.js"

router.post("/login", login);
router.put('/forgot-password', forgotPassword);
router.put('/reset-password', resetPassword);
export default router;