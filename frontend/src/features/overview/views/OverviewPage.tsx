import Dashboard from "../components/Dashboard";

// const formatRelativeDate = (dateStr: string) => {
//   const date = new Date(dateStr);
//   const now = new Date();
//   const diffDays = Math.floor(
//     (now.setHours(0, 0, 0, 0) - new Date(date).setHours(0, 0, 0, 0)) /
//       (1000 * 60 * 60 * 24),
//   );

//   if (diffDays === 0) return "šiandien";
//   if (diffDays === 1) return "vakar";
//   if (diffDays > 1 && diffDays < 7) return `prieš ${diffDays} d.`;

//   return date.toLocaleDateString("lt-LT", {
//     day: "numeric",
//     month: "long",
//   });
// };

export const OverviewPage = () => {
  // const { data: importInfo } = useQuery({
  //   queryKey: ["latestImportInfo"],
  //   queryFn: getLatestImportInfo,
  // });

  return (
    <div className="w-full bg-background px-8 py-7 h-full">
      <header className="mb-7 flex justify-between">
        <div className="">
          <h1 className="font-playfair text-2xl leading-[120%] font-medium text-(--text-primary-white)">
            Apžvalga
          </h1>
          {/* <h2 className="mt-2 mb-5 font-normal text-(--text-gray-400)">
            Sausis 2025 · 342 transakcijos · Paskutinis importas: vakar
          </h2> */}
        </div>
        {/* <div className="grid rounded-xl bg-(--opaque-green-insight-card-bg) p-4 text-right outline-2 outline-(--green-outline-card)">
          <span className="text-sm font-semibold text-(--neon-green)">
            ◎ Sutaupyta
          </span>
          <span className="text-3xl font-bold text-(--neon-green)">
            €347.40
          </span>
          <span className="text-(--text-gray-400)">🔥 3 mėn. iš eilės</span>
        </div> */}
      </header>
      <main className="">
        <Dashboard />
      </main>
    </div>
  );
};
