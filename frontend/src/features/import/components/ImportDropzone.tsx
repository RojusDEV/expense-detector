import importIcon from "@/assets/icons/import.svg";
import { useRef, useState, type ChangeEvent, type DragEvent } from "react";

interface ImportDropzoneProps {
  isDemo: boolean;
  onFilesSelected: (files: File[]) => void;
  onDemoClick: () => void;
}

export const ImportDropzone = ({
  isDemo,
  onFilesSelected,
  onDemoClick,
}: ImportDropzoneProps) => {
  
  const inputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    dragCounter.current = 0;
    setIsDragging(false);
    onFilesSelected(Array.from(event.dataTransfer.files));
  };

  const handleFileInput = (event: ChangeEvent<HTMLInputElement>) => {
    onFilesSelected(Array.from(event.target.files ?? []));
    event.target.value = "";
  };

  const handleClick = () => {
    if (isDemo) {
      onDemoClick();
      return;
    }
    inputRef.current?.click();
  };

  return (
    <div
      className={`mt-7 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed py-16 transition-colors ${
        isDemo
          ? "cursor-not-allowed opacity-50"
          : isDragging
            ? "cursor-pointer border-(--green-outline) bg-(--insight-card-bg)"
            : "cursor-pointer border-(--content-outline) hover:border-(--green-outline)"
      }`}
      onDrop={isDemo ? undefined : handleDrop}
      onDragOver={isDemo ? undefined : (event) => event.preventDefault()}
      onDragEnter={
        isDemo
          ? undefined
          : (event) => {
              event.preventDefault();
              dragCounter.current++;
              setIsDragging(true);
            }
      }
      onDragLeave={
        isDemo
          ? undefined
          : (event) => {
              event.preventDefault();
              dragCounter.current--;
              if (dragCounter.current === 0) setIsDragging(false);
            }
      }
      onClick={handleClick}
    >
      <input
        ref={inputRef}
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
  );
};
