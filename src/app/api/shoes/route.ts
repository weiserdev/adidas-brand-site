import { getPublicAiError } from "@/lib/ai-service-error";
import { searchShoes } from "@/lib/search-shoes/searchShoes";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export const POST = async (req: NextRequest) => {
    try {
        const body = await req.json();
        const { page, pageSize, sort, filters, aiQuery } = body ?? {};
        const data = await searchShoes({ page, pageSize, sort, filters, aiQuery });
        return NextResponse.json(data, { status: 200 });
    } catch (err: unknown) {
        console.error("Shoe search failed:", err);
        const failure = getPublicAiError(err);
        return NextResponse.json({ error: failure.error, aiUnavailable: failure.aiUnavailable }, { status: failure.status });
    }
};
