import Modal, {
  ModalHeading,
  ModalParagraph,
  type ModalHandle,
} from "@/shared/components/Modal";
import type { RefObject } from "react";
import type { NavigateFunction } from "react-router";

export const UploadLimitModal = ({
  modalRef,
  navigate,
}: {
  modalRef: RefObject<ModalHandle | null>;
  navigate: NavigateFunction;
}) => (
  <Modal ref={modalRef}>
    <div className="w-full max-w-95 text-center">
      <ModalHeading>Naudojatės demo versija</ModalHeading>
      <ModalParagraph>
        Demonstracinėje paskyroje failų įkelti negalima, jūs matote tik
        pavyzdinius duomenis. Susikurkite nemokamą paskyrą, kad galėtumėte
        įkelti savo banko išrašą.
      </ModalParagraph>
      <div className="mt-6 grid gap-4">
        <button
          className="cursor-pointer rounded-xl bg-[#0E8C62] p-3.5 font-semibold text-white"
          onClick={() => navigate("/auth/signup")}
        >
          Prisiregistruoti nemokamai
        </button>
        <button
          className="cursor-pointer text-[#6B7280] hover:text-[#52565f]"
          onClick={() => modalRef.current?.close()}
        >
          Gal vėliau
        </button>
      </div>
    </div>
  </Modal>
);
