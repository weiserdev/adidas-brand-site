
import { embedQuery } from "./embeddings";
import { query } from "./db";
import { Gender } from "@/types/types";

// - Similarity thresholds -
const HARD_CUTOFF = 0.50;
const SOFT_MARGIN = 0.05;
const MIN_SIM = HARD_CUTOFF - SOFT_MARGIN;

// Converts a JS number[] to a pgvector literal for parametrized query casting.
const toPgVector = (v: number[]): string => {
    if (!Array.isArray(v) || v.length === 0) return "[]";
    const body = v
        .map((x) => (Number.isFinite(x) ? Number(x).toFixed(6) : "0.000000"))
        .join(",");
    return `[${body}]`;
};

// Narrow unknown description to plain text string.
const descriptionToQueryText = (d: unknown): string => {
    if (typeof d === "string") return d.trim();
    if (d == null) return "";

    if (typeof d === "object") {
        const o = d as Record<string, unknown>;
        const candidates = ["text", "content", "summary", "description", "title", "details"];
        const parts: string[] = [];

        for (const k of candidates) {
            const v = o[k];
            if (typeof v === "string" && v.trim()) parts.push(v.trim());
        }

        if (Array.isArray(o.features)) {
            parts.push(
                (o.features as unknown[])
                    .filter((x) => typeof x === "string")
                    .join(" ")
            );
        }

        if (Array.isArray(o.tags)) {
            parts.push(
                (o.tags as unknown[])
                    .filter((x) => typeof x === "string")
                    .join(" ")
            );
        }

        if (parts.length > 0) return parts.join(" ").trim();
    }

    return "";
};

type Input = {
    description: unknown;
    topK?: number;
    excludeSlug?: string;
};

type Row = {
    shoe_id: string;
    slug: string;
    title: string;
    sku: string;
    gender: string;
    country: string | null;
    avg_price: number | null;
    rank: number | null;
    doc: string | null;
    vec_score: number;
};

// Maps a DB row to the public Shoe shape.
const mapRow = (r: Row) => ({
    id: r.shoe_id,
    slug: r.slug,
    title: r.title,
    sku: r.sku,
    gender: r.gender as Gender,
    country: r.country,
    avg_price: r.avg_price,
    rank: r.rank,
    description: r.doc,
    score: r.vec_score,
});

export const recommendByDescription = async (input: Input) => {
    const queryText = descriptionToQueryText(input.description);
    const topK = Math.max(1, Math.min(input.topK ?? 4, 10));

    if (!queryText) return [];

    // 1) Embed once
    const vec = await embedQuery(queryText);
    const vecLiteral = toPgVector(vec);

    // Common select
    const selectSql = `
    SELECT
      shoe_id,
      slug,
      title,
      sku,
      gender,
      country,
      avg_price::float AS avg_price,
      rank,
      doc,
      (1.0 - (embedding <=> $1::vector)) AS vec_score
    FROM embedding
  `;

    // 2) With threshold
    // Params: $1 = vector, $2 = excludeSlug?, last = LIMIT
    const paramsWithThreshold: unknown[] = [vecLiteral];
    const wherePartsWithThreshold: string[] = [
        `(1.0 - (embedding <=> $1::vector)) >= ${MIN_SIM}`,
    ];

    if (input.excludeSlug) {
        paramsWithThreshold.push(input.excludeSlug);
        wherePartsWithThreshold.push(`slug <> $${paramsWithThreshold.length}`);
    }

    paramsWithThreshold.push(topK);

    const sqlWithThreshold = `
    ${selectSql}
    WHERE ${wherePartsWithThreshold.join(" AND ")}
    ORDER BY vec_score DESC
    LIMIT $${paramsWithThreshold.length};
  `;

    const { rows: first } = await query<Row>(
        sqlWithThreshold,
        paramsWithThreshold
    );

    if (first.length >= topK) {
        return first.map(mapRow);
    }

    // 3) Fallback without threshold, but still exclude self if provided
    const paramsFallback: unknown[] = [vecLiteral];
    const wherePartsFallback: string[] = [];

    if (input.excludeSlug) {
        paramsFallback.push(input.excludeSlug);
        wherePartsFallback.push(`slug <> $${paramsFallback.length}`);
    }

    paramsFallback.push(topK);

    const sqlFallback = `
    ${selectSql}
    ${wherePartsFallback.length ? `WHERE ${wherePartsFallback.join(" AND ")}` : ""}
    ORDER BY vec_score DESC
    LIMIT $${paramsFallback.length};
  `;

    const { rows: second } = await query<Row>(
        sqlFallback,
        paramsFallback
    );

    return second.map(mapRow);
};
