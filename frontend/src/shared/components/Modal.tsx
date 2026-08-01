import { useImperativeHandle, useRef, type Ref } from "react";

interface ModalProps {
  children: React.ReactNode;
  ref?: Ref<ModalHandle>;
}
import { IoClose } from "react-icons/io5";
export interface ModalHandle {
  open: () => void;
  close: () => void;
}

const Modal = ({ children, ref }: ModalProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useImperativeHandle(
    ref,
    () => ({
      open: () => dialogRef.current?.showModal(),
      close: () => dialogRef.current?.close(),
    }),
    [],
  );

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) {
      dialogRef.current?.close();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      onCancel={() => dialogRef.current?.close()}
      onClick={handleBackdropClick}
      className="m-auto rounded-4xl p-3 font-(--font-poppins) backdrop:bg-black/60"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative flex flex-col items-center p-8"
      >
        <button
          className="absolute top-[1em] right-[1em] cursor-pointer"
          onClick={() => dialogRef.current?.close()}
        >
          <IoClose size={20} color="#9CA3AF" />
        </button>
        {children}
      </div>
    </dialog>
  );
};

export const ModalHeading = ({ children }: { children: React.ReactNode }) => {
  return <h1 className="text-lg font-semibold">{children}</h1>;
};


export const ModalParagraph = ({ children }: { children: React.ReactNode }) => {
  return (
    <p className="text-[#6B7280] mt-2">
                {children}
              </p>
  );
};

export default Modal;
