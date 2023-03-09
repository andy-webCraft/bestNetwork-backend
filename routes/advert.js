import express from "express";
import { getRandomAdvert } from "../controllers/advert.js";

const router = express.Router();

/* GET */
router.get("/", getRandomAdvert);

export default router;
