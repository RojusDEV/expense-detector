import { UploadLimitModal } from "@/components/InformModals";
import UploadFile from "@/components/UploadFile";
import type { ModalHandle } from "@/shared/components/Modal";
import { useUserStore } from "@/shared/store/userStore";
import { useRef } from "react";
import { useNavigate } from "react-router";
import { ImportDropzone } from "../components/ImportDropzone";
import { useImportFiles } from "../hooks/useImportFiles";

const ImportPage = () => {
  const modalRef = useRef<ModalHandle>(null);
  const navigate = useNavigate();
  const isDemo = useUserStore((state) => state.user?.role === "DEMO");
  const {
    files,
    error,
    isUploading,
    allUploaded,
    totalImported,
    totalDuplicated,
    addFiles,
    uploadFiles,
    removeFile,
    clearFiles,
  } = useImportFiles();

  const openUploadLimitModal = () => modalRef.current?.open();

  return (
    <div className="w-full bg-(--bg-primary-dashboard) px-8 py-7">
      <UploadLimitModal modalRef={modalRef} navigate={navigate} />

      <header>
        <h1 className="font-playfair text-2xl leading-[120%] font-medium text-(--text-primary-white)">
          Įkelti CSV failą
        </h1>
        <h2 className="font-normal text-(--text-gray-400)">
          Importuokite banko išrašą analizei
        </h2>
      </header>

      <ImportDropzone
        isDemo={isDemo}
        onFilesSelected={addFiles}
        onDemoClick={openUploadLimitModal}
      />

      {error && <span className="mt-2 block text-sm text-red-400">{error}</span>}

      {files.length > 0 && (
        <section className="mt-4 flex flex-col gap-3" aria-label="Pasirinkti failai">
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
            <UploadFile
              key={`${item.file.name}-${item.file.size}-${item.file.lastModified}`}
              item={item}
              index={index}
              removeFile={removeFile}
              isUploading={isUploading}
            />
          ))}

          {!allUploaded && (
            <button
              className="mt-1 w-fit cursor-pointer rounded-lg border border-[rgba(52,211,153,0.25)] bg-[rgba(52,211,153,0.10)] px-4 py-2 text-sm font-semibold text-[#34D399] transition-colors hover:bg-[rgba(52,211,153,0.20)] disabled:cursor-not-allowed disabled:opacity-40"
              onClick={isDemo ? openUploadLimitModal : uploadFiles}
              disabled={isUploading}
            >
              {isUploading
                ? "Keliama..."
                : `Įkelti ${files.length} fail${files.length === 1 ? "ą" : "us"}`}
            </button>
          )}
        </section>
      )}

      {allUploaded && (
        <section className="font-outfit mt-5 flex w-fit gap-6 rounded-2xl border-2 border-(--content-outline) bg-(--card-background) p-7 text-(--text-gray-400)">
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
        </section>
      )}
    </div>
  );
};

export default ImportPage;
