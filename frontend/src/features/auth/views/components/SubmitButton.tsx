import type { ReactNode } from "react";

const SubmitButton = ({
  children,
  isSubmitting,
}: {
  children: ReactNode;
  isSubmitting: boolean;
}) => {
  return (
    <button
      type="submit"
      disabled={isSubmitting}
      className="mt-6.5 rounded-md bg-(--btn-bg-green) py-2.5 font-semibold text-(--text-black) disabled:opacity-50"
    >
      {children}
    </button>
  );
};

export default SubmitButton;
