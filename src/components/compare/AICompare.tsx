import AiUnavailable from "@/components/common/AiUnavailable";
import Typed from "typed.js";
import toast from "react-hot-toast";
import { useCompareAnalysis } from "@/hooks/useCompareAnalysis";
import { useCompare } from "@/context/CompareContext";
import { Shoe } from "@/types/types";
import { useEffect, useRef } from "react";

const AICompare = ({ elements }: { elements: Shoe[] }) => {
    const {
        mutate: analyzeShoes,
        data,
        isPending,
        isError,
    } = useCompareAnalysis();

    const { compareResult, setCompareResult } = useCompare();

    const typedRef = useRef<HTMLDivElement>(null);
    const typedInstance = useRef<Typed | null>(null);

    // --- Run Typed animation when new output arrives ---
    useEffect(() => {
        const output = data?.output ?? compareResult;

        if (output && typedRef.current) {
            if (typedInstance.current) {
                typedInstance.current.destroy();
            }

            typedInstance.current = new Typed(typedRef.current, {
                strings: [output],
                typeSpeed: 10,
                backSpeed: 0,
                smartBackspace: false,
                showCursor: true,
                cursorChar: "|",
                contentType: "html",
            });
        }

        return () => {
            if (typedInstance.current) {
                typedInstance.current.destroy();
            }
        };
    }, [data?.output, compareResult]);

    // --- Save AI result in context ---
    useEffect(() => {
        if (data?.output) {
            setCompareResult(data.output);
        }
    }, [data?.output, setCompareResult]);

    // --- Toast helper ---
    const notify = () =>
        toast("At least 2 products are required for comparison.", {
            icon: "⚠️",
            style: {
                borderRadius: "10px",
                padding: "10px",
                background: "#333",
                color: "#fff",
                fontFamily: "Adineu Pro",
            },
        });

    // --- Trigger comparison ---
    const handleCompare = () => {
        if (elements.length < 2) notify();
        else analyzeShoes(elements as any);
    };

    return (
        <section className="mb-10 flex flex-col gap-4 font-adineu">
            <div className="flex flex-wrap justify-between items-center gap-4">
                <button
                    onClick={handleCompare}
                    disabled={isPending}
                    className={`px-5 py-2 rounded-md text-white transition-colors ${isPending || compareResult
                        ? "bg-gray-400 cursor-not-allowed"
                        : "headerbg hover:opacity-90 cursor-pointer"
                        }`}
                >
                    {isPending ? "Analyzing..." : "Compare with AI"}
                </button>
            </div>

            {/* --- AI OUTPUT FIELD --- */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 shadow-inner min-h-[6rem]">
                {isError && (
                    <AiUnavailable />
                )}

                {!isPending && !isError && !data?.output && !compareResult && (
                    <p className="text-gray-600 italic">
                        Click <strong>Compare with AI</strong> to see how our model analyzes heritage, comfort, and style - and recommends the best match for you.
                    </p>
                )}

                {isPending && (
                    <p className="text-blue-600 font-semibold">Analyzing shoes...</p>
                )}

                {(data?.output || compareResult) && (
                    <div
                        ref={typedRef}
                        className="font-adineu text-gray-800 leading-relaxed prose prose-blue max-w-none"
                    />
                )}
            </div>
        </section>
    );
};

export default AICompare;
