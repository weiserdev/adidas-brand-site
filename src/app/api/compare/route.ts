import { getPublicAiError } from "@/lib/ai-service-error";
import OpenAI from "openai";
import { NextResponse } from "next/server";

// Initialize the Hugging Face router-compatible OpenAI client
const client = new OpenAI({
    apiKey: process.env.HF_TOKEN,
    baseURL: "https://router.huggingface.co/v1",
});

export async function POST(req: Request) {
    try {
        const { details } = await req.json();

        if (!details || !Array.isArray(details)) {
            return NextResponse.json(
                { error: "Missing or invalid details (expected array of shoe objects)" },
                { status: 400 }
            );
        }

        // Build a compact summary string to send to the model
        const formattedShoes = details
            .map((shoe, i) => {
                return `
                    Shoe ${i + 1}:
                    - Title: ${shoe.title}
                    - Average price: €${shoe.avg_price?.toFixed(2) ?? "N/A"}
                    - Gender: ${shoe.gender}
                    - Country: ${shoe.country}
                    - Rank: ${shoe.rank}
                    - Description: ${shoe.description?.replace(/\s+/g, " ").trim().slice(0, 600) ?? "No description"}
                `.trim();
            })
            .join("\n\n");

        const completion = await client.chat.completions.create({
            model: process.env.AI_MODEL as string,
            messages: [
                {
                    role: "system",
                    content: `
                        You are a neutral product comparison assistant specialized in footwear at adidas company.
                        The user provides details for several adidas shoe models (typically 2–4).
                        You must:

                        1. **Compare them** in a structured, human-readable way.
                           - Mention price differences, target gender, origin (country), and qualitative aspects from the description.
                           - Identify unique selling points or drawbacks per shoe.
                        2. **Give a clear, concise recommendation**:
                           - Choose which shoe is most recommended overall and why.
                           - If relevant, specify what type of buyer or use case it best fits (e.g. "best for running", "best value for money").

                        Use natural English and avoid bullet points unless clarity benefits from them.
                        Keep it under 400 words.
                        Use simple HTML formatting (<p>, <strong>, <em>, <br>) for readability.
                        Write natural, clear English paragraphs.
                    `,
                },
                {
                    role: "user",
                    content: formattedShoes,
                },
            ],
            temperature: 0.7,
            max_tokens: 800,
        });

        return NextResponse.json({
            output: completion.choices[0].message?.content || null,
        });
    } catch (err: unknown) {
        console.error("HF API error:", err);
        const failure = getPublicAiError(err);
        return NextResponse.json(
            { error: failure.error, aiUnavailable: failure.aiUnavailable },
            { status: failure.status }
        );
    }
}
