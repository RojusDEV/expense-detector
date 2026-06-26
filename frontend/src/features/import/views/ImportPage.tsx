import importIcon from "@/assets/icons/import.svg";
import { useUploadCsv } from "@/shared/hooks/useUploadCsv";
import { useRef, useState, type DragEvent } from "react";

const MAX_SIZE = 10 * 1024 * 1024;

const ImportPage = () => {
  const [file, setFile] = useState<null | File>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const dragCounter = useRef(0);

  const { mutate, isSuccess, isError, data } = useUploadCsv(setUploadProgress);

  const handleUpload = () => {
    if (!file) return;
    setUploadProgress(0);
    mutate(file, {
      onSuccess: (result) => {
        console.log(result);
      },
      onError: () => {
        setError("Nežinoma klaida.");
      },
    });
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    dragCounter.current = 0;
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    const csv = droppedFiles.find((f) => f.name.endsWith(".csv"));
    if (!csv) {
      setError("Netinkamas formatas. Įkelkite CSV failą.");
      return;
    }
    if (csv.size > MAX_SIZE) {
      setError("Failas negali viršyti 10MB");
      return;
    }
    setError(null);
    setFile(csv);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    dragCounter.current++;
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    dragCounter.current--;
    if (dragCounter.current === 0) setIsDragging(false);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? [])[0];
    if (!selected) return;
    if (!selected.name.endsWith(".csv")) {
      setError("Netinkamas formatas. Įkelkite CSV failą.");
      return;
    }
    if (selected.size > MAX_SIZE) {
      setError("Failas negali viršyti 10MB");
      return;
    }
    setError(null);
    setFile(selected);
  };

  return (
    <div className="w-full bg-(--bg-primary-dashboard) px-8 py-7">
      <div className="">
        <h1 className="font-playfair text-2xl leading-[120%] font-medium text-(--text-primary-white)">
          Įkelti CSV failą
        </h1>
        <h2 className="font-normal text-(--text-gray-400)">
          Importuokite banko išrašą analizei
        </h2>
      </div>
      <div
        className={`mt-7 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed py-16 ${isDragging ? "border-(--green-outline)" : "border-(--content-outline)"}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onClick={() => document.getElementById("csv-input")?.click()}
      >
        <input
          id="csv-input"
          type="file"
          accept=".csv"
          className="hidden"
          onChange={handleFileInput}
        />
        <img src={importIcon} className="h-13.75 w-13.75" alt="import icon" />
        <span className="text-lg text-(--text-primary-white)">
          Vilkite CSV failą čia
        </span>
        <span className="text-(--text-gray-400)">
          arba paspauskite norėdami pasirinkti failą
        </span>
        <span className="text-sm text-(--text-gray-400)">
          Palaikomi formatai:{" "}
          <span className="text-sm font-bold text-(--label-gray-300)">
            Swedbank, SEB, Revolut
          </span>{" "}
          CSV eksportai
        </span>
      </div>

      {error && (
        <span className="mt-2 block text-sm text-red-400">{error}</span>
      )}

      {file && (
        <div className="mt-4 flex flex-col gap-2 rounded-xl border border-(--content-outline) px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-(--text-primary-white)">
                {file.name}
              </span>
              <span className="text-xs text-(--text-gray-400)">
                {(file.size / 1024).toFixed(1)} KB
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                className="cursor-pointer rounded-lg border border-red-400/25 bg-red-400/10 px-3 py-1.5 text-xs font-semibold text-red-400 transition-colors hover:bg-red-400/20 disabled:cursor-not-allowed disabled:opacity-40"
                onClick={() => setFile(null)}
                disabled={uploadProgress > 0 && !isSuccess && !isError}
              >
                Pašalinti
              </button>
              {isSuccess ? (
                <span className="text-xs font-semibold text-[#34D399]">
                  ✓ Įkelta
                </span>
              ) : (
                <button
                  className="cursor-pointer rounded-lg border border-[rgba(52,211,153,0.25)] bg-[rgba(52,211,153,0.10)] px-3 py-1.5 text-xs font-semibold text-[#34D399] transition-colors hover:bg-[rgba(52,211,153,0.20)] disabled:cursor-not-allowed disabled:opacity-40"
                  onClick={handleUpload}
                  disabled={uploadProgress > 0 && !isSuccess && !isError}
                >
                  {uploadProgress > 0 ? "Keliama..." : "Įkelti"}
                </button>
              )}
            </div>
          </div>

          {uploadProgress > 0 && (
            <div className="w-full">
              <div className="mb-1 flex justify-between text-xs text-(--text-gray-400)">
                <span>
                  {isSuccess ? "Įkelta!" : isError ? "Klaida" : "Keliama..."}
                </span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-(--content-outline)">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    isError ? "bg-red-400" : "bg-[#34D399]"
                  }`}
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      )}
      {isSuccess && (
        <div className="font-outfit mt-5 flex w-fit gap-6 rounded-2xl border-2 border-(--content-outline) bg-(--card-background) p-7 text-(--text-gray-400)">
          <div className="grid">
            <span>Importuota</span>
            <span className="text-xl font-bold text-(--success-color)">
              {data && data.importCount}
            </span>
            <span>transakcijos</span>
          </div>
          <div className="grid">
            <span>Duplikatai</span>
            <span className="text-xl font-bold text-(--medium-issue)">
              {data && data.duplicated}
            </span>
            <span>praleista</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImportPage;
