import { getAnomalies } from "@/shared/api/anomaliesApi";
import { useQuery } from "@tanstack/react-query";

const AnomaliesPage = () => {
  const {
    isError,
    isLoading,
    error,
    data: spendingAnomalies,
  } = useQuery({
    queryKey: ["spendingAnomalies"],
    queryFn: getAnomalies,
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span>{error.message}</span>;
  }

  return (
    <div className="w-full bg-(--bg-primary-dashboard) px-8 py-7">
      <h1 className="font-playfair text-2xl leading-[120%] font-medium text-(--text-primary-white)">
        Anomalijos
      </h1>
      <h2 className="mt-2 mb-5 font-normal text-(--text-gray-400)">
        Aptiktos neįprastos išlaidos
      </h2>
      <ul className="flex flex-col gap-3">
        {spendingAnomalies &&
          spendingAnomalies.map((anomaly) => (
            <li className="bg-(--opaque-red) rounded-lg px-4.5 py-4 outline-2 outline-(--outline-red)" key={anomaly.id}>
              <span className="text-(--text-primary-white)">{anomaly.explanation}</span>
              <div className="flex justify-between">
                <span className="text-(--text-gray-400) text-sm font-regular">
                  Tikėtasi: €{anomaly.expectedAmount} - Faktinė: 
                  <span className="text-[#F87171]"> €{anomaly.actualAmount}</span>
                </span>
                <button>Atmesti</button>
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default AnomaliesPage;
