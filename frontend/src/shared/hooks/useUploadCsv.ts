import { useMutation } from "@tanstack/react-query";
import { uploadCsvFile } from "../api/fileService";
import axios from "axios";

export const useUploadCsv = (
  setUploadProgress: React.Dispatch<React.SetStateAction<number>>,
) => {
  return useMutation({
    mutationFn: (file: File) => uploadCsvFile({ file }, setUploadProgress),
    onError: (error) => {
      setUploadProgress(0);
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        if (status === 400) return "Netinkamas CSV formatas.";
        if (status === 413) return "Failas per didelis.";
        if (status === 429) return "Failu";
        if (status === 500) return "Serverio klaida, bandykite vėliau.";
      }
    },
  });
};
