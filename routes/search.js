import express from "express";
const router = express.Router();

import {
	Searchbyuser,
} from "../controllers/search.js";

import {
	SearchbyTag,
	SearchbyTitle,
	searchbyinterests,
} from "../controllers/search.js";

router.get("/user/:name",Searchbyuser);
router.get("/btag/:tags",SearchbyTag);
router.get("/btitle/:title",SearchbyTitle);
router.get("/api/:interests",searchbyinterests);

export default router;