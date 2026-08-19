import { NavLink, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import {
  LuLayoutGrid,
  LuAlignLeft,
  LuStore,
  LuCreditCard,
  LuTriangleAlert,
  LuPiggyBank,
  LuLightbulb,
  LuLock,
  LuSearch,
  LuMoon,
  LuUpload,
} from "react-icons/lu";
import { useUserStore } from "../store/userStore";
import { capitalize } from "../../lib/utils";
type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

type LinkItem = {
  name: string;
  link: string;
  icon: React.ReactNode;
  locked?: boolean;
};

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const userStore = useUserStore((store) => store.user);

  const [isDark, setIsDark] = useState(() => {
    const stored = localStorage.getItem("theme");
    if (stored) return stored === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  const menuLinks: LinkItem[] = [
    { name: "Apžvalga", link: "", icon: <LuLayoutGrid /> },
    { name: "Transakcijos", link: "transactions", icon: <LuAlignLeft /> },
    { name: "Prekybininkai", link: "merchants", icon: <LuStore /> },
    { name: "Prenumeratos", link: "subscriptions", icon: <LuCreditCard /> },
    { name: "Anomalijos", link: "anomalies", icon: <LuTriangleAlert /> },
  ];

  const premiumLinks: LinkItem[] = [
    { name: "Taupymas", link: "savings", icon: <LuPiggyBank />, locked: true },
    { name: "Įžvalgos", link: "insights", icon: <LuLightbulb />, locked: true },
  ];

  const filterLinks = (arr: LinkItem[]) =>
    arr.filter((el) => el.name.toLowerCase().includes(search.toLowerCase()));

  const renderLink = (el: LinkItem) => {
    if (el.locked) {
      return (
        <li
          key={el.link}
          className="flex cursor-not-allowed items-center gap-2.5 py-2 pl-2 opacity-45 select-none"
        >
          <span className="flex h-4 w-4 items-center justify-center text-base text-(--label-gray-300) [&>svg]:h-full [&>svg]:w-full">
            {el.icon}
          </span>
          <span className="flex-1 text-sm font-medium text-(--label-gray-300)">
            {el.name}
          </span>
          <span className="pr-2 text-xs text-(--label-gray-300)">
            <LuLock />
          </span>
        </li>
      );
    }

    return (
      <NavLink
        to={el.link}
        key={el.link}
        end={el.link === ""}
        onClick={onClose}
        className={({ isActive }) =>
          `flex items-center gap-2.5 py-2 pl-2 select-none ${
            isActive
              ? "rounded-md border-l-3 border-(--btn-bg-green) bg-(--card-background) shadow-md shadow-black/20"
              : ""
          }`
        }
      >
        {({ isActive }) => (
          <>
            <span
              className={`${
                isActive
                  ? "text-(--text-primary-white)"
                  : "text-(--label-gray-300)"
              } flex h-4 w-4 items-center justify-center text-base [&>svg]:h-full [&>svg]:w-full`}
            >
              {el.icon}
            </span>
            <span
              className={`${
                isActive ? "text-(--text-primary-white)" : ""
              } cursor-pointer text-sm font-medium text-(--label-gray-300)`}
            >
              {el.name}
            </span>
          </>
        )}
      </NavLink>
    );
  };

  const menuFiltered = filterLinks(menuLinks);
  const premiumFiltered = filterLinks(premiumLinks);

  return (
    <div
      className={`font-outfit fixed top-0 left-0 z-40 h-screen max-h-screen min-h-full min-w-57.5 transform border-2 border-(--sidebar-outline) bg-(--side-bar-bg) transition-transform duration-300 ease-in-out md:sticky ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
    >
      <div className="sticky flex h-full flex-col justify-between py-5">
        <div className="px-4">
          <div className="flex items-center justify-between rounded-xl border border-(--sidebar-outline) bg-(--card-background) p-3">
            <div
              className="flex cursor-pointer items-center gap-3"
              onClick={() => navigate("/dashboard")}
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#34D399] text-lg font-semibold text-black">
                €
              </span>
              <span className="flex flex-col leading-tight">
                <span className="font-playfair text-lg text-(--text-primary-white)">
                  <span className="text-(--text-green-200)">€</span>xpense
                </span>
                <span className="text-xs font-light tracking-wide text-(--text-gray-400)">
                  Pattern Detector
                </span>
              </span>
            </div>
            <button
              onClick={onClose}
              aria-label="Close menu"
              className="text-xl leading-none text-(--text-gray-400) md:hidden"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="mt-4 px-4">
          <div className="flex items-center gap-2 rounded-lg border border-(--sidebar-outline) bg-(--card-background) px-3 py-2">
            <LuSearch className="text-sm text-(--text-gray-400)" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Ieškoti..."
              className="w-full bg-transparent text-sm text-(--text-primary-white) placeholder:text-(--text-gray-400) focus:outline-none"
            />
          </div>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto">
          {menuFiltered.length > 0 && (
            <div className="mt-5 px-5">
              <span className="px-2 text-[11px] font-semibold tracking-widest text-(--text-gray-400)">
                MENIU
              </span>
              <ul className="mt-2.5 flex flex-col gap-4">
                {menuFiltered.map(renderLink)}
              </ul>
            </div>
          )}

          {premiumFiltered.length > 0 && (
            <div className="mt-6 px-5">
              <span className="px-2 text-[11px] font-semibold tracking-widest text-(--text-gray-400)">
                PREMIUM
              </span>
              <ul className="mt-2.5 flex flex-col gap-4">
                {premiumFiltered.map(renderLink)}
              </ul>
            </div>
          )}
        </div>

        <div className="px-4">
          <div className="border-t border-(--sidebar-outline) pt-4">
            {/* Dark mode */}
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2.5">
                <LuMoon className="text-sm text-(--label-gray-300)" />
                <span className="text-sm font-medium text-(--text-primary-white)">
                  Tamsus režimas
                </span>
              </div>
              <button
                role="switch"
                aria-checked={isDark}
                onClick={() => setIsDark((v) => !v)}
                className={`flex h-6 w-11 cursor-pointer items-center rounded-full p-0.5 transition-colors ${
                  isDark ? "bg-[#34D399]" : "bg-(--sidebar-outline)"
                }`}
              >
                <span
                  className={`h-5 w-5 rounded-full bg-white transition-transform ${
                    isDark ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            <button
              className="mt-4 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#34D399] py-2.5"
              onClick={() => {
                navigate("import");
                onClose();
              }}
            >
              <LuUpload className="text-base text-black" />
              <span className="text-sm font-semibold text-black">
                Įkelti CSV
              </span>
            </button>

            {/* User */}
            <button className="mt-3 flex w-full cursor-pointer items-center gap-3 rounded-xl border border-(--sidebar-outline) bg-(--card-background) p-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[rgba(52,211,153,0.15)] text-sm font-semibold text-[#34D399]">
                {userStore?.name.charAt(0).toUpperCase()}
              </span>
              <span className="flex flex-1 flex-col items-start leading-tight">
                <span className="text-sm font-semibold text-(--text-primary-white)">
                  {capitalize(userStore?.name)}
                </span>
                <span className="text-xs text-(--text-gray-400)">
                  Swedbank · SEB · Revolut
                </span>
              </span>
              {/* <FiChevronDown className="text-sm text-(--text-gray-400)" /> */}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
