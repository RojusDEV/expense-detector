import { axiosFileClient } from "./axiosClient";

type FilePayload = {
  file: File;
};

type Data = {
  importCount: number;
  duplicated: number;
};

export const uploadCsvFile = async (
  payload: FilePayload,
  onProgress: (progress: number) => void,
): Promise<Data> => {
  const formData = new FormData();
  formData.append("file", payload.file);

  const response = await axiosFileClient.post("/upload/csv", formData, {
    onUploadProgress: (progressEvent) => {
      const progress = progressEvent.total
        ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
        : 0;

      onProgress(Math.min(progress, 99));
    },
    timeout: 50000,
  });

  onProgress(100);

  return response.data;
};
