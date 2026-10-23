
"use client";

import Image from "next/image";
import Loading, { LoadingSpinner } from "@/components/common/Loading";
import NotFound from "@/components/common/NotFound";
import FilterPanel from "@/components/shoes/FilterPanel";
import { ShoeSearchError, useShoesQuery } from "@/hooks/useShoeQuery";
import AiUnavailable from "@/components/common/AiUnavailable";
import { useCallback, useMemo, useState, KeyboardEvent } from "react";

import type { FilterState, SortOption, Shoe } from "@/types/types";
import Controls from "@/components/shoes/Controls";
import ShoeGrid from "@/components/shoes/ShoeGrid";
import Pagination from "@/components/shoes/Pagination";

const DEFAULT_FILTERS: FilterState = {
    gender: [],
    countries: [],
    priceMin: null,
    priceMax: null,
    nameSearch: "",
    skuSearch: "",
};

const PAGE_SIZE = 15;

const Content = () => {
    // States
    const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
    const [sortOption, setSortOption] = useState<SortOption>("");
    const [page, setPage] = useState(1);
    const [aiDraft, setAiDraft] = useState("");
    const [aiQuery, setAiQuery] = useState<string | undefined>();

    // Data fetching
    const { data, isLoading, isFetching, error } = useShoesQuery(
        page,
        PAGE_SIZE,
        filters,
        sortOption,
        aiQuery
    );

    const facets = useMemo(
        () =>
            data?.facets ?? {
                minPrice: null,
                maxPrice: null,
                countries: [] as string[],
            },
        [data]
    );

    // Event handlers
    const commitAiQuery = useCallback(() => {
        const q = aiDraft.trim();
        if (!q) return;
        setFilters(DEFAULT_FILTERS);
        setPage(1);
        setAiQuery(q);
    }, [aiDraft]);

    const clearAiQuery = useCallback(() => {
        setAiDraft("");
        setAiQuery(undefined);
        setPage(1);
    }, []);

    const handleFilterChange = (next: FilterState) => {
        setAiQuery(undefined);
        setAiDraft("");
        setFilters(next);
        setPage(1);
    };

    const handleResetFilters = () => {
        setAiQuery(undefined);
        setAiDraft("");
        setFilters(DEFAULT_FILTERS);
        setPage(1);
    };

    const onAiKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            commitAiQuery();
        }
    };

    // Derived values
    const total = data?.total ?? 0;
    const totalPages = data?.totalPages ?? 1;

    const showingStart = total
        ? (data!.page - 1) * (data!.pageSize || PAGE_SIZE) + 1
        : 0;

    const showingEnd = total
        ? Math.min(data!.page * (data!.pageSize || PAGE_SIZE), total)
        : 0;

    // Local sorting for AI results
    const sortedItems: Shoe[] = useMemo(() => {
        if (!data?.items) return [];

        if (aiQuery) {
            const items = [...data.items];

            const compareMap = {
                "price-asc": (a: Shoe, b: Shoe) =>
                    (a.avg_price ?? 0) - (b.avg_price ?? 0),
                "price-desc": (a: Shoe, b: Shoe) =>
                    (b.avg_price ?? 0) - (a.avg_price ?? 0),
                "rank-asc": (a: Shoe, b: Shoe) =>
                    (a.rank ?? 0) - (b.rank ?? 0),
                "rank-desc": (a: Shoe, b: Shoe) =>
                    (b.rank ?? 0) - (a.rank ?? 0),
                "name-asc": (a: Shoe, b: Shoe) =>
                    a.title.localeCompare(b.title),
                "name-desc": (a: Shoe, b: Shoe) =>
                    b.title.localeCompare(a.title),
            };

            const compare =
                compareMap[sortOption as keyof typeof compareMap];

            return compare ? items.sort(compare) : items;
        }

        return data.items;
    }, [data?.items, aiQuery, sortOption]);

    // An exhausted AI quota is a search-mode limitation, not a page failure.
    const aiUnavailable = Boolean(
        aiQuery &&
        error instanceof ShoeSearchError &&
        error.aiUnavailable
    );

    if (isLoading && !aiUnavailable) return <Loading />;

    if (error && !aiUnavailable) {
        return (
            <NotFound errorMsg={error.message ?? "Unknown error"} />
        );
    }

    return (
        <main className="relative flex min-h-[100dvh] w-full flex-col pb-[5rem] lg:flex-row 2xl:pb-[10rem]">
            <Image
                src="/splash/corner.webp"
                alt="splash"
                width={1600}
                height={1200}
                className="fixed top-0 left-0 z-[-1] h-auto opacity-50 2xl:w-1/2"
            />

            <aside className="top-[5.5rem] h-fit sm:w-3/4 lg:sticky lg:w-80 lg:flex-shrink-0">
                <FilterPanel
                    filters={filters}
                    onChange={handleFilterChange}
                    onReset={handleResetFilters}
                    facets={facets}
                />
            </aside>

            <div className="p-6 font-adineu lg:min-w-0 lg:flex-1">
                <Controls
                    aiDraft={aiDraft}
                    onAiChange={setAiDraft}
                    onAiKeyDown={onAiKeyDown}
                    commitAiQuery={commitAiQuery}
                    clearAiQuery={clearAiQuery}
                    sortOption={sortOption}
                    setSortOption={setSortOption}
                    total={total}
                    showingStart={showingStart}
                    showingEnd={showingEnd}
                    setPage={setPage}
                />

                {aiUnavailable ? (
                    <section
                        role="status"
                        className="relative mx-auto mt-4 w-full max-w-4xl"
                    >
                        <div className="relative rounded-xl border border-gray-200 bg-gray-50 px-6 pt-6 pb-[150px] shadow-sm md:min-h-[320px] md:p-6 md:pr-[210px]">
                            <div className="relative z-10">
                                <AiUnavailable />

                                <p className="mt-4 text-sm leading-relaxed text-gray-600">
                                    Regular shoe filters are still available. Clear your AI
                                    search or choose a filter to browse the collection.
                                </p>

                                <button
                                    type="button"
                                    onClick={clearAiQuery}
                                    className="mt-4 cursor-pointer rounded-md bg-black px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-gray-800"
                                >
                                    Browse Shoes
                                </button>
                            </div>
                        </div>

                        <Image
                            src="/other/exhausted.png"
                            alt="A tired Adidas AI robot taking a break"
                            width={580}
                            height={700}
                            sizes="(max-width: 767px) 180px, 250px"
                            className="pointer-events-none absolute -bottom-21 right-2 h-auto w-[180px] object-contain md:-right-5 md:-bottom-29 md:w-[250px]"
                        />
                    </section>
                ) : isFetching ? (
                    <div className="flex h-[60dvh] justify-center">
                        <LoadingSpinner />
                    </div>
                ) : (
                    <ShoeGrid items={sortedItems} />
                )}

                {!aiUnavailable && totalPages > 1 && !isFetching && (
                    <Pagination
                        currentPage={data?.page ?? 1}
                        totalPages={totalPages}
                        onPrev={() =>
                            setPage((p) => Math.max(1, p - 1))
                        }
                        onNext={() =>
                            setPage((p) => p + 1)
                        }
                    />
                )}
            </div>
        </main>
    );
};

export default Content;
