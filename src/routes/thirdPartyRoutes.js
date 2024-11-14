import express from "express";
import { fetchShip24 } from "../controllers/thirdPartyContoller.js";

const router = express.Router();

router.get("/ship24", fetchShip24);

export default router;
