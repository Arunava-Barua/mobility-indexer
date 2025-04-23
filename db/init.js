// src/db/init.js
import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

export async function initializeDatabase() {
  const connection = await mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
  });
  await connection.query(`CREATE DATABASE IF NOT EXISTS ${DB_NAME}`);
  await connection.end();

  const db = await mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
  });

  await db.query(`CREATE TABLE IF NOT EXISTS CollateralProofCreated (
    id VARCHAR(100) PRIMARY KEY,
    user VARCHAR(100),
    timestamp DATETIME
  )`);

  await db.query(`CREATE TABLE IF NOT EXISTS RelayerAttested (
    id VARCHAR(100) PRIMARY KEY,
    relayer VARCHAR(100),
    user VARCHAR(100),
    btcTxnHash TEXT,
    amount BIGINT,
    attestationCount INT,
    timestamp DATETIME
  )`);

  await db.end();
  console.log("✅ Database and tables are ready.");
}
