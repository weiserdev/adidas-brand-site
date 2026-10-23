import fs from "node:fs";
import path from "node:path";
import { Pool } from "pg";
import type { QueryResultRow } from "pg";

// Aiven's CA certificate takes precedence and enables verified TLS automatically.
const caPath = process.env.PGSSL_CA_PATH;
const ca = process.env.PGSSL_CA ||
    (caPath
        ? fs.readFileSync(path.resolve(/* turbopackIgnore: true */ process.cwd(), caPath), "utf8")
        : undefined);

const ssl = ca
    ? { ca, rejectUnauthorized: true }
    : process.env.PGSSL === "true"
        ? { rejectUnauthorized: true }
        : undefined;

export const pool = new Pool({
    host: process.env.PGHOST,
    port: Number(process.env.PGPORT || 5432),
    database: process.env.PGDATABASE,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    ssl,
    connectionTimeoutMillis: 10000,
    query_timeout: 15000,
});

// Ensure search_path for every new connection
pool.on("connect", (client) => {
    // Keep public for extensions like pgvector
    void client.query("SET search_path TO shoes, public");
});

export const query = async <T extends QueryResultRow = any>(
    sql: string,
    params: unknown[] = []
) => {
    return pool.query<T>(sql, params);
};