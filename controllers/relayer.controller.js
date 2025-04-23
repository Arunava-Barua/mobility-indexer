// src/controllers/relayerController.js
import { getRelayerAttestations } from "../services/relayerService.js";

export async function fetchRelayerAttestations(req, res) {
  try {
    const data = await getRelayerAttestations();
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: "Server error" });
  }
}
