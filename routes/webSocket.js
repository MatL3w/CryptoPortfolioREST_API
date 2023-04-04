import express from "express";
import expressWs from "express-ws";

import * as webSocketController from "../controllers/webSocket.js";
import * as Authentication from "../middleware/is-auth-ws.js";

export const router = express.Router();

router.ws("/socket",Authentication.isAuth,webSocketController.socketConnection);
