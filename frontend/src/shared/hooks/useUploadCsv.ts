import { useMutation } from "@tanstack/react-query";
import { uploadCsvFile } from "../api/fileService";

export const useUploadCsv = (onProgress: (progress: number) => void) => {
  return useMutation({
    mutationFn: (file: File) => uploadCsvFile({ file }, onProgress),

    onError: () => {
      onProgress(0);
    },
  });
};
