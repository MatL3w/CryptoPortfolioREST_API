import {Router} from "express";
import * as authController from '../controllers/auth.js';

export const router = Router();

router.get('/',authController.helloWorld);

router.post("/signup", authController.signup);

router.post("/signin", authController.signin);


