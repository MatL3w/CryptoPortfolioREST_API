import {Router} from "express";
import * as authController from '../controllers/auth.js';
import * as Authentication from "../middleware/is-auth.js";

export const router = Router();

router.post("/signup", authController.signup);

router.post("/signin", authController.signin);

router.post("/logout",Authentication.isAuth, authController.logout);

router.post("/changepassword", Authentication.isAuth, authController.changePassowrd);

router.post("/changeemail", Authentication.isAuth, authController.changeEmail);


