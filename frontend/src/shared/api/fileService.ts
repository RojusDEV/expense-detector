import { axiosFileClient } from "./axiosClient";

type FilePayload = {
  file: File;
};

type data = {
  importCount: number;
  duplicated: number;
};

export const uploadCsvFile = async (
  payload: FilePayload,
  setUploadProgress: React.Dispatch<React.SetStateAction<number>>,
): Promise<data> => {
  const formData = new FormData();
  formData.append("file", payload.file);

  const data = await axiosFileClient.post("/upload/csv", formData, {
    onUploadProgress: (progressEvent) => {
      const progress = progressEvent.total
        ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
        : 0;
      setUploadProgress(Math.min(progress, 99));
    },
    timeout: 50000,
  });

  setUploadProgress(100);
  return data.data;
};
