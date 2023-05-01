import express from "express";
const router = express.Router();
import {
    interest,
    subInterest,
} from "../controllers/interests.js";
router.get('/', interest);
router.get('/:interestName', subInterest);




export default router;