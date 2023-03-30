import { Router } from "express";
import * as feedController from "../controllers/feed.js";
import * as Authentication from "../middleware/is-auth.js";

export const router = Router();

router.post("/upsertasset",Authentication.isAuth, feedController.upsertAsset);

router.delete('/deleteasset',Authentication.isAuth, feedController.deleteAsset);

router.get("/getassets", Authentication.isAuth, feedController.getAssets);

router.get("/getasset", Authentication.isAuth, feedController.getAsset);