import { NextResponse } from "next/server";
import { searchShoe } from "@/lib/search-shoes/searchShoe";

export const dynamic = "force-dynamic";

type DatabaseError = Error & { code?: string };

const requiredDatabaseVariables = [
    "PGHOST",
    "PGPORT",
    "PGDATABASE",
    "PGUSER",
    "PGPASSWORD",
] as const;

export const GET = async (
    _request: Request,
    context: { params: Promise<{ slug: string }> }
) => {
    const { slug } = await context.params;
    const missing = requiredDatabaseVariables.filter((key) => !process.env[key]);

    if (missing.length) {
        // Report variable names only; never log credentials or connection strings.
        console.error("Shoe API: missing PostgreSQL environment variables:", missing.join(", "));
        return NextResponse.json(
            {
                message: "Shoe database is not configured.",
                code: "DB_CONFIG_MISSING",
                ...(process.env.NODE_ENV !== "production" ? { missingVariables: missing } : {}),
            },
            { status: 503 }
        );
    }

    try {
        const shoe = await searchShoe(slug);
        if (!shoe) {
            return NextResponse.json({ message: "Shoe not found." }, { status: 404 });
        }
        return NextResponse.json(shoe, { status: 200 });
    } catch (error: unknown) {
        const dbError = error instanceof Error ? (error as DatabaseError) : null;
        console.error("Shoe API: database query failed", {
            code: dbError?.code ?? "UNKNOWN",
            name: dbError?.name ?? "UnknownError",
            // Full error details are available in the server terminal only.
            error,
        });
        return NextResponse.json(
            {
                message: "Error loading shoe.",
                code: "DB_QUERY_FAILED",
                ...(process.env.NODE_ENV !== "production"
                    ? { databaseErrorCode: dbError?.code ?? "UNKNOWN" }
                    : {}),
            },
            { status: 500 }
        );
    }
};
