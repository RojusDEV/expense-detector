export type UploadStatus = "waiting" | "uploading" | "success" | "error";

export interface IUploadFile {
  file: File;
  status: UploadStatus;
  progress: number;
  error?: string;
  importCount?: number;
  duplicated?: number;
}

interface UploadFileProps {
  item: IUploadFile;
  removeFile: (index: number) => void;
  index: number;
  isUploading: boolean;
}

const UploadFile = ({
  item,
  removeFile,
  index,
  isUploading,
}: UploadFileProps) => {
  return (
    <div
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
              <span className="text-xs text-(--text-gray-400)">Laukia</span>

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
            <span className="text-xs font-semibold text-red-400">✕ Klaida</span>
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
        <span className="mt-2 block text-xs text-red-400">{item.error}</span>
      )}
    </div>
  );
};

export default UploadFile;
