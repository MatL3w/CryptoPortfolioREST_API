import {Router} from "express";
import feedController from '../controllers/feed.js';

const router = Router();

router.get('/',feedController.helloWorld);

//router.get("/", feedController.helloWorld);

export default {router};
