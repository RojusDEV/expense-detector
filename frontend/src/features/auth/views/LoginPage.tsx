import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { loginApi } from "../../../shared/api/AuthApi";
import { useAuth } from "../../../shared/hooks/AuthContext";
import FormInput from "./components/FormInput";
import SubmitButton from "./components/SubmitButton";

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
    <div className="font-outfit bg-background h-dvh text-(--text-primary-white)">
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
            <FormInput<Inputs>
              label="El. paštas"
              name="email"
              inputType="email"
              register={register}
              error={errors.email}
              placeholder="vardenis@gmail.com"
              autoComplete="email"
              
            />
            <FormInput<Inputs>
              label="Slaptažodis"
              name="password"
              inputType="password"
              register={register}
              error={errors.password}
              placeholder="slaptažodis"
              className="mt-4.5"
              autoComplete="password"
            />
            {apiError && (
              <span className="mt-3 text-xs text-red-400">{apiError}</span>
            )}
            <SubmitButton isSubmitting={isSubmitting}>
              {isSubmitting ? "Jungiamasi..." : "Prisijungti"}
            </SubmitButton>
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
