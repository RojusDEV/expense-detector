import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { registerApi } from "../../../shared/api/AuthApi";

type Inputs = {
  name: string;
  email: string;
  password: string;
};

const RegisterPage = () => {
  const [defaultBank, setDefaultBank] = useState("swedbank");
  const navigate = useNavigate();
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      setApiError(null);
      const payload = { ...data, defaultBank };
      await registerApi(payload);
      navigate("/auth/login");
    } catch (error: any) {
      console.error(error);
      const message = error.response?.data?.message ?? "Registracija nepavyko";
      setApiError(message);
    }
  };

  return (
    <div className="bg-background font-outfit h-screen text-(--text-primary-white)">
      <div className="grid h-full place-items-center">
        <div className="relative grid w-full max-w-100 overflow-hidden rounded-2xl bg-(--card-background) px-10 py-12 outline-1 outline-(--input-outline)">
          <div className="pointer-events-none absolute -top-15 -right-15 h-40 w-40 rounded-full bg-[#34D399] opacity-15 blur-3xl" />
          <span className="font-playfair text-3xl">
            <span className="text-(--text-green-200)">€</span>xpense Detector
          </span>
          <span className="mt-2.5 text-sm font-normal text-(--text-gray-400)">
            Sukurkite naują paskyrą
          </span>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 grid">
            <label
              htmlFor="name"
              className="mb-1.5 text-[11px] font-semibold text-(--label-gray-300)"
            >
              Vardas
            </label>
            <input
              type="text"
              id="name"
              className={`rounded-md bg-(--input-bg-black) px-3.5 py-3 text-sm outline-1 ${
                errors.name ? "outline-red-500" : "outline-(--input-outline)"
              }`}
              placeholder="Vardenis"
              {...register("name", { required: true, maxLength: 50 })}
            />
            {errors.name && (
              <span className="mt-1 text-xs text-red-400">
                Vardas yra privalomas
              </span>
            )}

            <label
              htmlFor="email"
              className="mt-4.5 mb-1.5 text-[11px] font-semibold text-(--label-gray-300)"
            >
              El. paštas
            </label>
            <input
              type="email"
              id="email"
              className={`rounded-md bg-(--input-bg-black) px-3.5 py-3 text-sm outline-1 ${
                errors.email ? "outline-red-500" : "outline-(--input-outline)"
              }`}
              placeholder="vardenis@gmail.com"
              {...register("email", { required: true, maxLength: 50 })}
            />
            {errors.email && (
              <span className="mt-1 text-xs text-red-400">
                El. paštas yra privalomas
              </span>
            )}

            <label
              htmlFor="password"
              className="mt-4.5 mb-1.5 text-[11px] font-semibold text-(--label-gray-300)"
            >
              Slaptažodis
            </label>
            <input
              type="password"
              id="password"
              className={`rounded-md bg-(--input-bg-black) px-3.5 py-3 text-sm outline-1 ${
                errors.password
                  ? "outline-red-500"
                  : "outline-(--input-outline)"
              }`}
              placeholder="slaptažodis"
              {...register("password", {
                required: true,
                minLength: 6,
                maxLength: 80,
              })}
            />
            {errors.password?.type === "minLength" && (
              <span className="mt-1 text-xs text-red-400">
                Slaptažodis turi būti bent 6 simbolių
              </span>
            )}
            {errors.password?.type === "required" && (
              <span className="mt-1 text-xs text-red-400">
                Slaptažodis yra privalomas
              </span>
            )}

            <div className="mt-4.5">
              <span className="text-[11px] font-medium text-(--label-gray-300)">
                Pagrindinis bankas
              </span>
              <div className="mt-2.5 flex gap-2 *:flex-1">
                {["swedbank", "SEB", "revolut"].map((bank) => (
                  <div
                    key={bank}
                    onClick={() => setDefaultBank(bank)}
                    className={`cursor-pointer rounded-lg py-2.5 pl-2.5 outline-2 ${
                      defaultBank === bank
                        ? "bg-[rgba(52,211,153,0.10)] outline-(--text-green-200)"
                        : "outline-(--input-outline)"
                    }`}
                  >
                    <span
                      className={`text-sm font-medium text-(--label-gray-300) ${
                        defaultBank === bank ? "text-[#34D399]" : ""
                      }`}
                    >
                      {bank.charAt(0).toUpperCase() + bank.slice(1)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {apiError && (
              <span className="mt-3 text-xs text-red-400">{apiError}</span>
            )}

            <button
              className="mt-6.5 rounded-md bg-(--btn-bg-green) py-2.5 font-semibold text-(--text-black) disabled:opacity-50"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Registruojama..." : "Registruotis"}
            </button>
          </form>
          <span className="mt-5 text-center text-[13px] text-(--text-gray-400)">
            Jau turite paskyrą?{" "}
            <Link
              to="/auth/login"
              className="font-bold text-(--text-green-200)"
            >
              Prisijungti
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
