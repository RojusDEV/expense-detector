import fullLogo from "@/assets/logos/fullLogo.svg";
import { useEffect, useState } from "react";
import { LuMoonStar } from "react-icons/lu";
import { useNavigate } from "react-router";

const NavBar = () => {
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(() => {
    const stored = localStorage.getItem("theme");
    if (stored) return stored === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  return (
    <nav className="bg-hero-nav-bg border-hero-border-faint border-b px-8 py-3.5">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <div className="cursor-pointer">
          <img src={fullLogo} alt="buisiness logo" className="h-7" />
        </div>
        <ul className="text-hero-text-muted flex gap-7.5 text-[14px] font-medium">
          <li className="cursor-pointer">Funkcijos</li>
          <li className="cursor-pointer">Kainos</li>
          <li className="cursor-pointer">DUK</li>
          <li className="cursor-pointer">Kontaktai</li>
        </ul>
        <div className="flex items-center gap-3 text-[14px]">
          <button
            className="border-hero-control-border text-hero-text-primary flex cursor-pointer items-center justify-center rounded-[9px] border p-3"
            onClick={() => setIsDark((prev) => !prev)}
          >
            <LuMoonStar />
          </button>
          <button
            className="border-hero-control-border text-hero-text-primary cursor-pointer rounded-[9px] border px-4 py-2.25"
            onClick={() => navigate("/auth/login")}
          >
            Prisijungti
          </button>
          <button className="bg-hero-btn-dark-bg text-hero-btn-dark-text cursor-pointer rounded-[9px] px-4.5 py-2.25">
            Pradėti nemokamai
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
