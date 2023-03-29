import { Router } from "express";
import * as feedController from "../controllers/feed.js";
import * as Authentication from "../middleware/is-auth.js";

export const router = Router();

router.post("/editasset",Authentication.isAuth, feedController.editAsset);

router.delete('/deleteasset',Authentication.isAuth, feedController.deleteAsset);