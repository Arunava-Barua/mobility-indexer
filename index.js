import express from "express";
import dotenv from "dotenv";
import collateralRoutes from "./routes/collateral.route.js";
import relayerRoutes from "./routes/relayers.route.js";

import { listenToSuiEvents } from "./listeners/suiEvents.js";
import { initializeDatabase } from "./db/init.js";

dotenv.config();

const app = express();
app.use(express.json());

app.use("/api/collateral", collateralRoutes);
app.use("/api/relayers", relayerRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);

  console.log("🛠️ Running DB init...");
  try {
    await initializeDatabase();
    console.log("✅ Database initialized.");
  } catch (err) {
    console.error("❌ Database init failed:", err);
    process.exit(1); // Stop the server if DB init fails
  }

  // Start the Sui websocket
  console.log("Starting Sui websocket...");
  listenToSuiEvents();
});
