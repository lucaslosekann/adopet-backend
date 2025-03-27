import { Router } from "express";
import RequestHandler from "../Helpers/RequestHandler";

import * as OngController from "../Controllers/OngController";

const Ong = Router();

Ong.post("/", RequestHandler(OngController.register));

export default Ong;
