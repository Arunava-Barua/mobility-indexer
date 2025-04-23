// src/routes/collateral.js
import express from "express";
import { fetchCollateralProofs } from "../controllers/collateral.controller.js";

const router = express.Router();
router.get("/", fetchCollateralProofs);
export default router;
