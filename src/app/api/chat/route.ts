import { getPublicAiError } from "@/lib/ai-service-error";
import OpenAI from "openai";
import { NextResponse } from "next/server";
import { langMap } from "@/data/langMap";
import { franc } from "franc-min";

const client = new OpenAI({
    apiKey: process.env.HF_TOKEN,
    baseURL: "https://router.huggingface.co/v1",
});

export async function POST(req: Request) {
    try {
        const { prompt } = await req.json();

        if (!prompt) {
            return NextResponse.json({ error: "Missing prompt" }, { status: 400 });
        }

        // --- Detect user language using franc-min ---
        const langCode = franc(prompt || "");
        const detectedLang = langMap[langCode]?.name || "English";

        // --- Build dynamic system message ---
        const systemMessage = `
            You are Adee, the official Adidas AI assistant.
            You only answer questions about Adidas products, history, athletes, technologies, campaigns, or brand values.
            If asked about anything unrelated to Adidas, politely apologize and ask if the user has any Adidas-related questions.
            Your responses must be concise—maximum 40 words.
            If the user just says hello, say hello back and ask if you can help them with Adidas but in this case don't ask
            if you can help with anything else.
            If it is not clear what the question refers to, assume that it refers to the Adidas brand.
            At the end of every response, include the sentence translated into ${detectedLang} language:
            "Can I help you with anything else about Adidas?", except the case
            when the user only greeted you without any other question. In this case the last sentence should be the ${detectedLang} translated version of
            "Can I help you with anything about Adidas?".

            Important language rules:
            - The user's language is ${detectedLang}.
            - You must reply fully in ${detectedLang}.
            - Never mix languages in a single reply.
            - Never use English phrases if the user's language is not English.
            - Translate every part of your response, including closing sentences, into ${detectedLang}.
            - Use natural style and punctuation for ${detectedLang}.
        `;

        // --- Call the AI model ---
        const completion = await client.chat.completions.create({
            model: process.env.AI_MODEL as string,
            messages: [
                { role: "system", content: systemMessage },
                { role: "user", content: prompt },
            ],
        });

        // --- Return the AI's reply ---
        return NextResponse.json({
            output: completion.choices[0].message?.content || null,
            detectedLang,
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
