import { Calendar } from "@/shared/components/ui/calendar";
import { useFilterStore } from "@/shared/store/filterStore";
import { format } from "date-fns";
import { useEffect, useRef, useState } from "react";

const TransactionsFilters = () => {
  // const [fromDate, setFromDate] = useState<Date | undefined>(undefined);
  // const [toDate, setToDate] = useState<Date | undefined>(undefined);

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

  return (
    <div className="flex gap-2">
      <div ref={fromRef} className="relative shrink-0">
        <button
          onClick={() => {
            setShowFrom((p) => !p);
            setShowTo(false);
          }}
          className="rounded-md bg-(--input-bg-black) px-3 py-2 text-[0.75rem] font-medium text-(--text-primary-white) outline-1 outline-(--content-outline)"
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
                // setFromDate(d);
                setFilter("fromDate", d);
                setShowFrom(false);
              }}
              className="rounded-lg border"
            />
          </div>
        )}
      </div>
      <div ref={toRef} className="relative shrink-0">
        <button
          onClick={() => {
            setShowTo((p) => !p);
            setShowFrom(false);
          }}
          className="rounded-md bg-(--input-bg-black) px-3 py-2 text-[0.75rem] font-medium text-(--text-primary-white) outline-1 outline-(--content-outline)"
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
                // setToDate(d);
                setFilter("toDate", d);
                setShowTo(false);
              }}
              className="rounded-lg border"
            />
          </div>
        )}
      </div>

      <div className="shrink-0 rounded-md bg-(--input-bg-black) px-3 py-2 text-[0.75rem] font-medium whitespace-nowrap text-(--text-primary-white) outline-1 outline-(--content-outline)">
        Visos Kategorijos
      </div>

      <input
        type="text"
        placeholder="🔍 Ieškoti prekybininko..."
        className="w-full rounded-md bg-(--input-bg-black) px-3 py-2 text-[0.75rem] font-medium text-(--text-primary-white) outline-1 outline-(--content-outline)"
        onChange={(e) => setFilter("search", e.target.value)}
      />

      <input
        type="number"
        placeholder="Min €"
        className="w-20 shrink-0 rounded-md bg-(--input-bg-black) px-3 py-2 text-[0.75rem] font-medium text-(--text-primary-white) outline-1 outline-(--content-outline)"
        onChange={(e) => setFilter("minAmount", Number(e.target.value))}
      />
      <input
        type="number"
        placeholder="Max €"
        className="w-20 shrink-0 rounded-md bg-(--input-bg-black) px-3 py-2 text-[0.75rem] font-medium text-(--text-primary-white) outline-1 outline-(--content-outline)"
        onChange={(e) => setFilter("maxAmount", Number(e.target.value))}
      />
    </div>
  );
};

export default TransactionsFilters;
