import { Router } from "express";
import {body} from "express-validator";
import * as feedController from "../controllers/feed.js";
import * as Authentication from "../middleware/is-auth.js";


export const router = Router();

router.post("/upsertasset",Authentication.isAuth,[body('assetNameTag').not().isEmpty().isString().trim(), body('assetQuantity').toFloat().isNumeric()], feedController.upsertAsset);

router.delete('/deleteasset',Authentication.isAuth,[body('assetNameTag').not().isEmpty().isString().trim()], feedController.deleteAsset);

router.get("/getassets", Authentication.isAuth, feedController.getAssets);

router.get("/getasset", Authentication.isAuth, feedController.getAsset);