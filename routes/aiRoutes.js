import express from "express";
import { generateTaskAI } from "../controllers/aiController.js";

const router = express.Router();

router.post("/generate", generateTaskAI);

export default router;
