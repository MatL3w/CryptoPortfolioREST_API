import {Router} from "express";
import * as feedController from '../controllers/feed.js';

export const router = Router();

router.get('/',feedController.helloWorld);

router.post("/signup", feedController.signup);

router.post('/signin',feedController.signin);


