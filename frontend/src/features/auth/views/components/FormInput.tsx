import type { HTMLInputTypeAttribute } from "react";
import type {
  FieldError,
  FieldValues,
  Path,
  UseFormRegister,
} from "react-hook-form";

type FormInputProps<T extends FieldValues> = {
  label: string;
  name: Path<T>;
  inputType: HTMLInputTypeAttribute;
  register: UseFormRegister<T>;
  error?: FieldError;
  placeholder?: string;
  required?: boolean;
  className?: string;
};

const FormInput = <T extends FieldValues>({
  label,
  name,
  inputType,
  register,
  error,
  placeholder,
  className = "",
}: FormInputProps<T>) => {
  return (
    <div className={`grid ${className}`}>
      <label
        htmlFor={name}
        className="mb-1.5 text-[11px] font-semibold text-(--label-gray-300)"
      >
        {label}
      </label>
      <input
        type={inputType}
        id={name}
        className={`rounded-md bg-(--input-bg-black) px-3.5 py-3 text-sm outline-1 ${
          error ? "outline-red-500" : "outline-(--input-outline)"
        }`}
        placeholder={placeholder}
        {...register(name, { required: "Privalomas laukas" })}
      />
    </div>
  );
};

export default FormInput;
