import {Router} from "express";
import { body,header } from "express-validator";
import * as authController from '../controllers/auth.js';
import * as Authentication from "../middleware/is-auth.js";

export const router = Router();

router.post(
    "/signup",
    body('email').not().isEmpty().isString().trim().isEmail(),
    body('password').not().isEmpty(),
    body('name').not().isEmpty().isString().trim(),
    authController.signup
);

router.post(
  "/signin",
  body("email").not().isEmpty().isString().trim().isEmail(),
  body("password").not().isEmpty(),
  authController.signin
);

router.post(
    "/logout",
    header('Authorization').not().isEmpty().isJWT(),
    Authentication.isAuth,
     authController.logout
);

router.post(
  "/changepassword",
  header("Authorization").not().isEmpty().isJWT(),
  body("oldPassword").not().isEmpty(),
  body("newPassword").not().isEmpty(),
  Authentication.isAuth,
  authController.changePassowrd
);

router.post(
  "/changeemail",
  header("Authorization").not().isEmpty().isJWT(),
  body("newEmail").not().isEmpty().isString().trim().isEmail(),
  Authentication.isAuth,
  authController.changeEmail
);


