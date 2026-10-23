import { AI_DEMO_URL, AI_UNAVAILABLE_MESSAGE, AI_UNAVAILABLE_TITLE } from "@/lib/ai-service-error";

const AiUnavailable = () => (
    <div className="font-adineu text-base leading-relaxed">
        <p className="font-semibold mb-2">{AI_UNAVAILABLE_TITLE}</p>
        <p className="whitespace-pre-line">{AI_UNAVAILABLE_MESSAGE}</p>
        <a className="mt-2 inline-block font-semibold underline underline-offset-4" href={AI_DEMO_URL} target="_blank" rel="noopener noreferrer">
            Watch Video Demo →
        </a>
    </div>
);

export default AiUnavailable;
