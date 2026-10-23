export const AI_UNAVAILABLE_TITLE = "AI Demo Usage Limit Reached";

export const AI_UNAVAILABLE_MESSAGE =
    "This portfolio project uses a free-tier AI inference service, and its monthly usage allowance has been exhausted.\n" +
    "Live AI interactions are currently paused. You can explore the rest of the showcase or watch the video demo to see these features in action.";

export const AI_DEMO_URL = "https://www.youtube.com/watch?v=seFdUCY5SCM";

export const isInferenceCreditError = (error: unknown): boolean => {
    const value = error instanceof Error ? error.message : String(error);
    return /\b402\b|no remaining credits|purchase pre-paid credits|insufficient.*credit/i.test(value);
};

export const getPublicAiError = (error: unknown): { error: string; status: number; aiUnavailable: boolean } => {
    if (isInferenceCreditError(error)) {
        return { error: AI_UNAVAILABLE_MESSAGE, status: 503, aiUnavailable: true };
    }
    return { error: "This request could not be completed right now. Please try again later.", status: 502, aiUnavailable: false };
};
