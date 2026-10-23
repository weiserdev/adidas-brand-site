"use client";

import AiUnavailable from "@/components/common/AiUnavailable";

import ShoeCard from "../shoes/ShoeCard";
import Image from "next/image";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Description, Shoe } from "@/types/types";

const toPlainText = (d: Description): string => {
    if (typeof d === "string") return d.trim();
    return "";
};

type Props = {
    description: Description;
    excludeSlug?: string;
};

const Recommendation = ({ description, excludeSlug }: Props) => {
    const descriptionText = useMemo(() => toPlainText(description), [description]);

    const {
        data: items = [],
        isLoading,
        isFetching,
        isError,
    } = useQuery<Shoe[]>({
        queryKey: ["recommendations", descriptionText, excludeSlug],
        queryFn: async () => {
            const res = await fetch("/api/recommendations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ description: descriptionText, topK: 4, excludeSlug }),
                cache: "no-store",
            });
            if (!res.ok) {
                let message = "Request failed";
                try {
                    const payload = await res.json();
                    if (payload?.error) message = payload.error;
                } catch (err) {
                    console.error(err)
                }
                throw new Error(message);
            }
            const json = await res.json();
            return Array.isArray(json?.items) ? (json.items as Shoe[]) : [];
        },
        enabled: descriptionText.length > 0,
        staleTime: 60_000,
        gcTime: 5 * 60_000,
        retry: 1,
        refetchOnWindowFocus: false,
    });

    // If the query errors or there is nothing to show, render nothing.
    if (isError) return (
        <section className="container mx-auto mt-24 px-5 sm:px-0">
            <h2 className="font-doodle text-4xl sm:text-5xl lg:text-6xl mb-5 text-blue-800">AI suggestions</h2>
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 shadow-inner">
                <AiUnavailable />
            </div>
        </section>
    );
    if (!isLoading && items.length === 0) return null;

    return (
        <section className="container mx-auto mt-24">
            <h1 className="font-doodle pl-5 sm:pl-0 text-4xl sm:text-5xl lg:text-6xl mb-5 text-blue-800">
                AI suggestions
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-x-5 gap-y-6">
                {isLoading || (isFetching && items.length === 0)
                    ? Array.from({ length: 4 }).map((_, i) => (
                        <div
                            key={`skeleton-${i}`}
                            className="animate-pulse flex items-center justify-center h-64 rounded-lg bg-slate-200"
                        >
                            <Image
                                src="/other/logo-transparent.png"
                                alt="logo"
                                width={400}
                                height={400}
                                className="w-1/2 opacity-50"
                            />
                        </div>
                    ))
                    : items.map((shoe, index) => (
                        <ShoeCard key={shoe.slug} {...{ shoe, index }} />
                    ))}
            </div>
            <p className="font-adineu italic mt-2">*These recommendations are generated using machine learning on Adidas shoe data.</p>
        </section>
    );
};

export default Recommendation;
