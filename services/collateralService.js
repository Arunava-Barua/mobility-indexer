// src/services/collateralService.js
import pool from "../db/db.js";

export async function getCollateralProofs() {
  const [rows] = await pool.query(
    "SELECT * FROM CollateralProofCreated ORDER BY timestamp DESC"
  );
  return rows;
}
