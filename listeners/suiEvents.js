// // src/listeners/suiEvents.js
// import { SuiClient, getFullnodeUrl } from '@mysten/sui/client';
// import pool from '../db/db.js';

// const CONTRACT_ADDRESS = '0x489bde9145cb80b04783696140a5d8306d1da6c4eaa42b3343390149d34aaa57';

// export async function listenToSuiEvents() {
//   const client = new SuiClient({ url: getFullnodeUrl('testnet') });

//   await client.queryEvents
//   await client.subscribeEvent({
//     filter: { MoveModule: { module: 'attest_btc_deposit', package: CONTRACT_ADDRESS } },
//     onMessage: async (event) => {
//       const { id, type, parsedJson, timestampMs } = event;
//       const timestamp = new Date(Number(timestampMs));

//       if (type.includes('CollateralProofCreated')) {
//         const sql = `INSERT INTO CollateralProofCreated (id, user, timestamp) VALUES (?, ?, ?)`;
//         await pool.execute(sql, [id, parsedJson.user, timestamp]);
//         console.log('[✔] CollateralProofCreated stored');
//       }

//       if (type.includes('RelayerAttested')) {
//         const sql = `INSERT INTO RelayerAttested (id, relayer, user, btcTxnHash, amount, attestationCount, timestamp)
//                      VALUES (?, ?, ?, ?, ?, ?, ?)`;
//         await pool.execute(sql, [
//           id,
//           parsedJson.relayer,
//           parsedJson.user,
//           parsedJson.attestation_data.btc_txn_hash,
//           parsedJson.attestation_data.amount,
//           parsedJson.attestation_count,
//           timestamp,
//         ]);
//         console.log('[✔] RelayerAttested stored');
//       }
//     },
//   });
// }

// src/listeners/suiEvents.js
import { SuiClient, getFullnodeUrl } from "@mysten/sui/client";
import schedule from "node-schedule";
import pool from "../db/db.js";

const CONTRACT_ADDRESS =
  "0x489bde9145cb80b04783696140a5d8306d1da6c4eaa42b3343390149d34aaa57";
const MODULE_NAME = "attest_btc_deposit";

const client = new SuiClient({ url: getFullnodeUrl("testnet") });

let lastCursor = null;

export function listenToSuiEvents() {
  console.log("🕒 Scheduling Sui event polling every 5 seconds...");

  // Runs every 5 seconds
  schedule.scheduleJob("*/5 * * * * *", async () => {
    try {
      console.log("⏳ Polling Sui events...");
      const { data, nextCursor } = await client.queryEvents({
        query: {
          MoveModule: {
            package: CONTRACT_ADDRESS,
            module: MODULE_NAME,
          },
        },
        limit: 10,
        order: "ascending",
        cursor: lastCursor,
      });

      console.log(data)
      console.log(nextCursor)
      for (const event of data) {
        const { id, type, parsedJson, timestampMs } = event;
        const timestamp = new Date(Number(timestampMs));

        if (type.includes("CollateralProofCreated")) {
          const sql = `INSERT IGNORE INTO CollateralProofCreated (id, user, timestamp) VALUES (?, ?, ?)`;
          await pool.execute(sql, [id.txDigest, parsedJson.user, timestamp]);
          console.log("[✔] CollateralProofCreated stored");
        }

        if (type.includes("RelayerAttested")) {
          const sql = `INSERT IGNORE INTO RelayerAttested (id, relayer, user, btcTxnHash, amount, attestationCount, timestamp)
                       VALUES (?, ?, ?, ?, ?, ?, ?)`;
          await pool.execute(sql, [
            id.txDigest,
            parsedJson.relayer,
            parsedJson.user,
            parsedJson.attestation_data.btc_txn_hash,
            parsedJson.attestation_data.amount,
            parsedJson.attestation_count,
            timestamp,
          ]);
          console.log("[✔] RelayerAttested stored");
        }
      }

      if (nextCursor) {
        lastCursor = nextCursor;
      }
    } catch (error) {
      console.error("❌ Failed to poll Sui events:", error.message);
    }
  });
}
