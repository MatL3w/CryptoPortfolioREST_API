import { Router } from "express";
import {body,header} from "express-validator";
import * as feedController from "../controllers/feed.js";
import * as Authentication from "../middleware/is-auth.js";


export const router = Router();

router.post("/asset",
  header("Authorization").not().isEmpty().isJWT(),
  body("assetNameTag").not().isEmpty().isString().trim(),
  body("assetQuantity").toFloat().isNumeric(),
  Authentication.isAuth,
  feedController.upsertAsset
);

router.delete("/asset",
    Authentication.isAuth,
    header("Authorization").not().isEmpty().isJWT(),
    body("assetNameTag").not().isEmpty().isString().trim(),
    feedController.deleteAsset
);

router.get("/asset",
    header("Authorization").not().isEmpty().isJWT(),
    Authentication.isAuth,
    feedController.getAssets
);
