import { getPublicAiError } from "@/lib/ai-service-error";
import { NextRequest, NextResponse } from "next/server";
import { recommendByDescription } from "@/lib/search-shoes/recommendByDescription";

export const dynamic = "force-dynamic";

export const POST = async (req: NextRequest) => {
    try {
        const body = await req.json();
        const { description, topK = 4, excludeSlug } = body ?? {};

        // Empty description is not an error - just return an empty list
        if (!description) {
            return NextResponse.json({ items: [] }, { status: 200 });
        }

        const items = await recommendByDescription({
            description,
            topK,
            excludeSlug,
        });

        return NextResponse.json({ items }, { status: 200 });
    } catch (err: unknown) {
        console.error("Recommendations failed:", err);
        const failure = getPublicAiError(err);
        return NextResponse.json(
            { error: failure.error, aiUnavailable: failure.aiUnavailable },
            { status: failure.status }
        );
    }
};
