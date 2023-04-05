import express from "express";
const router = express.Router();

import {
	Searchbyuser,
} from "../controllers/search.js";

import {
	SearchbyTag,
	SearchbyTitle,
} from "../controllers/search.js";

router.get("/user/:name",Searchbyuser);
router.get("/btag/:tags",SearchbyTag);
router.get("/btitle/:title",SearchbyTitle);

export default router;