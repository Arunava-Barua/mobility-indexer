// src/services/relayerService.js
import pool from "../db/db.js";

export async function getRelayerAttestations() {
  const [rows] = await pool.query(
    "SELECT * FROM RelayerAttested ORDER BY timestamp DESC"
  );
  return rows;
}
