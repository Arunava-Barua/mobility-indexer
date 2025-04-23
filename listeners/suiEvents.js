// src/listeners/suiEvents.js
import { SuiClient, getFullnodeUrl } from '@mysten/sui/client';
import pool from '../db/db.js';

const CONTRACT_ADDRESS = '0x58fd4af89d8481a971d9458e5410e8952dfbf98f9105060c654757d744efd033';

export async function listenToSuiEvents() {
  const client = new SuiClient({ url: getFullnodeUrl('testnet') });

  await client.subscribeEvent({
    filter: { MoveModule: { module: 'attest_btc_deposit', package: CONTRACT_ADDRESS } },
    onMessage: async (event) => {
      const { id, type, parsedJson, timestampMs } = event;
      const timestamp = new Date(Number(timestampMs));

      if (type.includes('CollateralProofCreated')) {
        const sql = `INSERT INTO CollateralProofCreated (id, user, timestamp) VALUES (?, ?, ?)`;
        await pool.execute(sql, [id, parsedJson.user, timestamp]);
        console.log('[✔] CollateralProofCreated stored');
      }

      if (type.includes('RelayerAttested')) {
        const sql = `INSERT INTO RelayerAttested (id, relayer, user, btcTxnHash, amount, attestationCount, timestamp)
                     VALUES (?, ?, ?, ?, ?, ?, ?)`;
        await pool.execute(sql, [
          id,
          parsedJson.relayer,
          parsedJson.user,
          parsedJson.attestation_data.btc_txn_hash,
          parsedJson.attestation_data.amount,
          parsedJson.attestation_count,
          timestamp,
        ]);
        console.log('[✔] RelayerAttested stored');
      }
    },
  });
}