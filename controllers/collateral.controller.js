// src/controllers/collateralController.js
import { getCollateralProofs } from "../services/collateralService.js";

export async function fetchCollateralProofs(req, res) {
  try {
    const data = await getCollateralProofs();
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: "Server error" });
  }
}
