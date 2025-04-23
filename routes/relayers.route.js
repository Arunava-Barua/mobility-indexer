// src/routes/relayers.js
import express from "express";
import { fetchRelayerAttestations } from "../controllers/relayer.controller.js";

const router = express.Router();
router.get("/", fetchRelayerAttestations);
export default router;
