import { Router } from "express";
import * as feedController from "../controllers/feed.js";

export const router = Router();

router.post("/editasset", feedController.editAsset);
