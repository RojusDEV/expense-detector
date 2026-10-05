import { useCallback, useState } from "react";
import { useUploadCsv } from "@/shared/hooks/useUploadCsv";
import type { IUploadFile } from "@/components/UploadFile";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const getFileKey = (file: File) =>
  `${file.name}-${file.size}-${file.lastModified}`;

const getUploadError = (error: unknown) =>
  error instanceof Error ? error.message : "Nepavyko įkelti failo.";

export const useImportFiles = () => {
  const [files, setFiles] = useState<IUploadFile[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const { mutateAsync } = useUploadCsv((progress) => {
    setFiles((currentFiles) =>
      currentFiles.map((item) =>
        item.status === "uploading" ? { ...item, progress } : item,
      ),
    );
  });

  const addFiles = useCallback((selectedFiles: File[]) => {
    if (selectedFiles.length === 0) return;

    const invalidFile = selectedFiles.find(
      (file) => !file.name.toLowerCase().endsWith(".csv"),
    );
    if (invalidFile) {
      setError("Netinkamas formatas. Įkelkite tik CSV failus.");
      return;
    }

    const oversizedFile = selectedFiles.find(
      (file) => file.size > MAX_FILE_SIZE,
    );
    if (oversizedFile) {
      setError(`${oversizedFile.name} viršija 10MB limitą.`);
      return;
    }

    setError(null);
    setFiles((currentFiles) => {
      const existingFiles = new Set(
        currentFiles.map(({ file }) => getFileKey(file)),
      );

      return [
        ...currentFiles,
        ...selectedFiles
          .filter((file) => !existingFiles.has(getFileKey(file)))
          .map((file) => ({ file, status: "waiting" as const, progress: 0 })),
      ];
    });
  }, []);

  const uploadFiles = useCallback(async () => {
    if (files.length === 0 || isUploading) return;

    setError(null);
    setIsUploading(true);

    for (let index = 0; index < files.length; index++) {
      const currentFile = files[index];
      if (currentFile.status === "success") continue;

      setFiles((currentFiles) =>
        currentFiles.map((item, itemIndex) =>
          itemIndex === index
            ? { ...item, status: "uploading", progress: 0, error: undefined }
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
      } catch (uploadError) {
        const errorMessage = getUploadError(uploadError);
        setFiles((currentFiles) =>
          currentFiles.map((item, itemIndex) =>
            itemIndex === index
              ? { ...item, status: "error", error: errorMessage }
              : item,
          ),
        );
        setError(errorMessage);
        break;
      }
    }

    setIsUploading(false);
  }, [files, isUploading, mutateAsync]);

  const removeFile = useCallback(
    (index: number) => {
      if (isUploading) return;
      setFiles((currentFiles) =>
        currentFiles.filter((_, itemIndex) => itemIndex !== index),
      );
    },
    [isUploading],
  );

  const clearFiles = useCallback(() => {
    if (isUploading) return;
    setFiles([]);
    setError(null);
  }, [isUploading]);

  return {
    files,
    error,
    isUploading,
    addFiles,
    uploadFiles,
    removeFile,
    clearFiles,
    allUploaded:
      files.length > 0 && files.every((file) => file.status === "success"),
    totalImported: files.reduce(
      (sum, file) => sum + (file.importCount ?? 0),
      0,
    ),
    totalDuplicated: files.reduce(
      (sum, file) => sum + (file.duplicated ?? 0),
      0,
    ),
  };
};
