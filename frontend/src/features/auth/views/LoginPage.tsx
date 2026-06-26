import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { loginApi } from "../../../shared/api/AuthApi";
import { useAuth } from "../../../shared/hooks/AuthContext";

type Inputs = {
  email: string;
  password: string;
};

const LoginPage = () => {
  const navigate = useNavigate();
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>();
  const { login } = useAuth();
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      const response = await loginApi(data);
      login(response);
      navigate("/dashboard");
    } catch (error: any) {
      const message = error.response?.data?.message ?? "Prisijungti nepavyko";
      setApiError(message);
    }
  };

  return (
    <div className="font-outfit h-screen bg-background text-(--text-primary-white)">
      <div className="grid h-full place-items-center">
        <div className="relative grid w-full max-w-100 overflow-hidden rounded-2xl bg-(--card-background) px-10 py-12 outline-1 outline-(--input-outline)">
          <div className="pointer-events-none absolute -top-15 -right-15 h-40 w-40 rounded-full bg-[#34D399] opacity-15 blur-3xl" />
          <span className="font-playfair text-3xl">
            <span className="text-(--text-green-200)">€</span>xpense Detector
          </span>
          <span className="mt-2.5 text-sm font-normal text-(--text-gray-400)">
            Prisijunkite prie savo paskyros
          </span>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 grid">
            <label
              htmlFor="email"
              className="mb-1.5 text-[11px] font-semibold text-(--label-gray-300)"
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
              {...register("email", { required: true })}
            />
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
              {...register("password", { required: true })}
            />
            {apiError && (
              <span className="mt-3 text-xs text-red-400">{apiError}</span>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-6.5 rounded-md bg-(--btn-bg-green) py-2.5 font-semibold text-(--text-black) disabled:opacity-50"
            >
              {isSubmitting ? "Jungiamasi..." : "Prisijungti"}
            </button>
          </form>
          <span className="mt-5 text-center text-[13px] text-(--text-gray-400)">
            Neturite paskyros?{" "}
            <Link
              to="/auth/register"
              className="font-bold text-(--text-green-200)"
            >
              Registruotis
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
