import { Calendar } from "@/shared/components/ui/calendar";
import { useFilterStore } from "@/shared/store/filterStore";
import { format } from "date-fns";
import { useEffect, useRef, useState } from "react";

const TransactionsFilters = () => {
  const filters = useFilterStore((state) => state.filters);
  const setFilter = useFilterStore((state) => state.setFilter);

  const [showFrom, setShowFrom] = useState(false);
  const [showTo, setShowTo] = useState(false);

  const fromRef = useRef<HTMLDivElement>(null);
  const toRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (fromRef.current && !fromRef.current.contains(e.target as Node))
        setShowFrom(false);
      if (toRef.current && !toRef.current.contains(e.target as Node))
        setShowTo(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const inputClass =
    "rounded-md bg-(--input-bg-black) px-3 py-2 text-[0.75rem] font-medium text-(--text-primary-white) outline-1 outline-(--content-outline)";

  return (
    <div className="flex w-full min-w-0 flex-col gap-2 md:flex-row md:flex-wrap md:items-center">
      <input
        type="text"
        placeholder="🔍 Ieškoti prekybininko..."
        className={`${inputClass} order-first w-full md:order-3 md:w-auto md:max-w-60`}
        onChange={(e) => setFilter("search", e.target.value)}
      />

      <div className="flex gap-2">
        <div
          ref={fromRef}
          className="relative min-w-0 flex-1 md:flex-none md:shrink-0"
        >
          <button
            onClick={() => {
              setShowFrom((p) => !p);
              setShowTo(false);
            }}
            className={`${inputClass} w-full whitespace-nowrap md:w-auto`}
          >
            {filters?.fromDate
              ? format(filters?.fromDate, "yyyy-MM-dd")
              : "Nuo datos"}
          </button>
          {showFrom && (
            <div className="absolute top-full left-0 z-50 mt-1">
              <Calendar
                mode="single"
                selected={filters?.fromDate}
                onSelect={(d) => {
                  setFilter("fromDate", d);
                  setShowFrom(false);
                }}
                className="rounded-lg border"
              />
            </div>
          )}
        </div>
        <div
          ref={toRef}
          className="relative min-w-0 flex-1 md:flex-none md:shrink-0"
        >
          <button
            onClick={() => {
              setShowTo((p) => !p);
              setShowFrom(false);
            }}
            className={`${inputClass} w-full whitespace-nowrap md:w-auto`}
          >
            {filters?.toDate
              ? format(filters?.toDate, "yyyy-MM-dd")
              : "Iki datos"}
          </button>
          {showTo && (
            <div className="absolute top-full left-0 z-50 mt-1">
              <Calendar
                mode="single"
                selected={filters?.toDate}
                onSelect={(d) => {
                  setFilter("toDate", d);
                  setShowTo(false);
                }}
                className="rounded-lg border"
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-2">
        <div
          className={`${inputClass} flex-1 whitespace-nowrap md:flex-none md:shrink-0`}
        >
          Visos Kategorijos
        </div>
        <input
          type="number"
          placeholder="Min €"
          className={`${inputClass} w-20 shrink-0 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`}
          onChange={(e) => setFilter("minAmount", Number(e.target.value))}
        />
        <input
          type="number"
          placeholder="Max €"
          className={`${inputClass} w-20 shrink-0 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`}
          onChange={(e) => setFilter("maxAmount", Number(e.target.value))}
        />
      </div>
    </div>
  );
};

export default TransactionsFilters;
