import importIcon from "@/assets/icons/import.svg";
import { UploadLimitModal } from "@/components/InformModals";
import type { ModalHandle } from "@/shared/components/Modal";
import { useUploadCsv } from "@/shared/hooks/useUploadCsv";
import { useUserStore } from "@/shared/store/userStore";
import { useRef, useState, type DragEvent } from "react";
import { useNavigate } from "react-router";

const MAX_SIZE = 10 * 1024 * 1024;

type UploadStatus = "waiting" | "uploading" | "success" | "error";

interface UploadFile {
  file: File;
  status: UploadStatus;
  progress: number;
  error?: string;
  importCount?: number;
  duplicated?: number;
}

const ImportPage = () => {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const dragCounter = useRef(0);
  const modalRef = useRef<ModalHandle>(null);

  const user = useUserStore((state) => state.user);
  const isDemo = user?.role === "DEMO";

  const navigate = useNavigate();

  const { mutateAsync } = useUploadCsv((progress: number) => {
    setFiles((currentFiles) =>
      currentFiles.map((item) =>
        item.status === "uploading"
          ? {
              ...item,
              progress,
            }
          : item,
      ),
    );
  });

  const validateFiles = (selectedFiles: File[]) => {
    const invalidFile = selectedFiles.find(
      (file) => !file.name.toLowerCase().endsWith(".csv"),
    );

    if (invalidFile) {
      setError("Netinkamas formatas. Įkelkite tik CSV failus.");
      return false;
    }

    const oversizedFile = selectedFiles.find((file) => file.size > MAX_SIZE);

    if (oversizedFile) {
      setError(`${oversizedFile.name} viršija 10MB limitą.`);
      return false;
    }

    return true;
  };

  const addFiles = (selectedFiles: File[]) => {
    if (selectedFiles.length === 0) return;

    if (!validateFiles(selectedFiles)) return;

    setError(null);

    setFiles((currentFiles) => {
      const existingFiles = new Set(
        currentFiles.map(
          (item) =>
            `${item.file.name}-${item.file.size}-${item.file.lastModified}`,
        ),
      );

      const newFiles = selectedFiles
        .filter(
          (file) =>
            !existingFiles.has(
              `${file.name}-${file.size}-${file.lastModified}`,
            ),
        )
        .map((file) => ({
          file,
          status: "waiting" as UploadStatus,
          progress: 0,
        }));

      return [...currentFiles, ...newFiles];
    });
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    dragCounter.current = 0;
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);

    addFiles(droppedFiles);
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

    if (dragCounter.current === 0) {
      setIsDragging(false);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files ?? []);

    addFiles(selectedFiles);

    e.target.value = "";
  };

  const handleUpload = async () => {
    if (files.length === 0 || isUploading) return;

    if (isDemo) {
      modalRef.current?.open();
      return;
    }

    setError(null);
    setIsUploading(true);

    for (let index = 0; index < files.length; index++) {
      const currentFile = files[index];

      if (currentFile.status === "success") {
        continue;
      }

      setFiles((currentFiles) =>
        currentFiles.map((item, itemIndex) =>
          itemIndex === index
            ? {
                ...item,
                status: "uploading",
                progress: 0,
                error: undefined,
              }
            : item,
        ),
      );

      try {
        const result = await mutateAsync(currentFile.file);

        setFiles((currentFiles) =>
          currentFiles.map((item, itemIndex) =>
            itemIndex === index
              ? {
                  ...item,
                  status: "success",
                  progress: 100,
                  importCount: result.importCount,
                  duplicated: result.duplicated,
                }
              : item,
          ),
        );
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Nepavyko įkelti failo.";

        setFiles((currentFiles) =>
          currentFiles.map((item, itemIndex) =>
            itemIndex === index
              ? {
                  ...item,
                  status: "error",
                  error: errorMessage,
                }
              : item,
          ),
        );

        setError(errorMessage);
        break;
      }
    }

    setIsUploading(false);
  };

  const removeFile = (index: number) => {
    if (isUploading) return;

    setFiles((currentFiles) =>
      currentFiles.filter((_, itemIndex) => itemIndex !== index),
    );
  };

  const clearFiles = () => {
    if (isUploading) return;

    setFiles([]);
    setError(null);
  };

  const hasFiles = files.length > 0;

  const totalImported = files.reduce(
    (sum, file) => sum + (file.importCount ?? 0),
    0,
  );

  const totalDuplicated = files.reduce(
    (sum, file) => sum + (file.duplicated ?? 0),
    0,
  );

  const allUploaded =
    hasFiles && files.every((file) => file.status === "success");

  return (
    <div className="w-full bg-(--bg-primary-dashboard) px-8 py-7">
      <UploadLimitModal modalRef={modalRef} navigate={navigate} />

      <div>
        <h1 className="font-playfair text-2xl leading-[120%] font-medium text-(--text-primary-white)">
          Įkelti CSV failą
        </h1>

        <h2 className="font-normal text-(--text-gray-400)">
          Importuokite banko išrašą analizei
        </h2>
      </div>

      <div
        className={`mt-7 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed py-16 transition-colors ${
          isDemo
            ? "cursor-not-allowed opacity-50"
            : isDragging
              ? "cursor-pointer border-(--green-outline) bg-(--insight-card-bg)"
              : "cursor-pointer border-(--content-outline) hover:border-(--green-outline)"
        }`}
        onDrop={isDemo ? undefined : handleDrop}
        onDragOver={isDemo ? undefined : handleDragOver}
        onDragEnter={isDemo ? undefined : handleDragEnter}
        onDragLeave={isDemo ? undefined : handleDragLeave}
        onClick={() =>
          isDemo
            ? modalRef.current?.open()
            : document.getElementById("csv-input")?.click()
        }
      >
        <input
          id="csv-input"
          type="file"
          accept=".csv"
          multiple
          className="hidden"
          onChange={handleFileInput}
        />

        <img src={importIcon} className="h-13.75 w-13.75" alt="import icon" />

        <span className="text-lg text-(--text-primary-white)">
          Vilkite CSV failus čia
        </span>

        <span className="text-(--text-gray-400)">
          arba paspauskite norėdami pasirinkti failus
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

      {hasFiles && (
        <div className="mt-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-(--text-primary-white)">
              Failai ({files.length})
            </span>

            {!isUploading && (
              <button
                className="cursor-pointer text-xs text-(--text-gray-400) transition-colors hover:text-red-400"
                onClick={clearFiles}
              >
                Pašalinti visus
              </button>
            )}
          </div>

          {files.map((item, index) => (
            <div
              key={`${item.file.name}-${item.file.size}-${item.file.lastModified}`}
              className="rounded-xl border border-(--content-outline) bg-(--card-background) px-4 py-3"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2">
                  <span className="truncate text-sm text-(--text-primary-white)">
                    {item.file.name}
                  </span>

                  <span className="shrink-0 text-xs text-(--text-gray-400)">
                    {(item.file.size / 1024).toFixed(1)} KB
                  </span>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  {item.status === "waiting" && (
                    <>
                      <span className="text-xs text-(--text-gray-400)">
                        Laukia
                      </span>

                      <button
                        className="cursor-pointer rounded-lg border border-red-400/25 bg-red-400/10 px-3 py-1.5 text-xs font-semibold text-red-400 transition-colors hover:bg-red-400/20 disabled:cursor-not-allowed disabled:opacity-40"
                        onClick={() => removeFile(index)}
                        disabled={isUploading}
                      >
                        Pašalinti
                      </button>
                    </>
                  )}

                  {item.status === "uploading" && (
                    <span className="text-xs font-semibold text-(--success-color)">
                      Keliama...
                    </span>
                  )}

                  {item.status === "success" && (
                    <span className="text-xs font-semibold text-(--success-color)">
                      ✓ Įkelta
                    </span>
                  )}

                  {item.status === "error" && (
                    <span className="text-xs font-semibold text-red-400">
                      ✕ Klaida
                    </span>
                  )}
                </div>
              </div>

              {item.status === "uploading" && (
                <div className="mt-3 w-full">
                  <div className="mb-1 flex justify-between text-xs text-(--text-gray-400)">
                    <span>Keliama...</span>
                    <span>{item.progress}%</span>
                  </div>

                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-(--content-outline)">
                    <div
                      className="h-full rounded-full bg-[#34D399] transition-all duration-300"
                      style={{
                        width: `${item.progress}%`,
                      }}
                    />
                  </div>
                </div>
              )}

              {item.status === "error" && item.error && (
                <span className="mt-2 block text-xs text-red-400">
                  {item.error}
                </span>
              )}
            </div>
          ))}

          {!allUploaded && (
            <button
              className="mt-1 w-fit cursor-pointer rounded-lg border border-[rgba(52,211,153,0.25)] bg-[rgba(52,211,153,0.10)] px-4 py-2 text-sm font-semibold text-[#34D399] transition-colors hover:bg-[rgba(52,211,153,0.20)] disabled:cursor-not-allowed disabled:opacity-40"
              onClick={isDemo ? () => modalRef.current?.open() : handleUpload}
              disabled={isUploading}
            >
              {isUploading
                ? "Keliama..."
                : `Įkelti ${files.length} fail${files.length === 1 ? "ą" : "us"}`}
            </button>
          )}
        </div>
      )}

      {allUploaded && (
        <div className="font-outfit mt-5 flex w-fit gap-6 rounded-2xl border-2 border-(--content-outline) bg-(--card-background) p-7 text-(--text-gray-400)">
          <div className="grid">
            <span>Importuota</span>

            <span className="text-xl font-bold text-(--success-color)">
              {totalImported}
            </span>

            <span>transakcijos</span>
          </div>

          <div className="grid">
            <span>Duplikatai</span>

            <span className="text-xl font-bold text-(--medium-issue)">
              {totalDuplicated}
            </span>

            <span>praleista</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImportPage;
