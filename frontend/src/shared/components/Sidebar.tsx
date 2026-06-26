import { useState } from "react";
import { Link, useNavigate } from "react-router";

const Sidebar = () => {
  const navigate = useNavigate();
  const url = window.location.href;
  const [selectedTab, setSelectedTab] = useState(url.split("/").at(-1) || "");

  const links = [
    {
      name: "Apžvalga",
      link: "",
    },
    {
      name: "Transakcijos",
      link: "transactions",
    },
    {
      name: "Prekybininkai",
      link: "merchants",
    },
    {
      name: "Prenumeratos",
      link: "subscriptions",
    },
    {
      name: "Anomalijos",
      link: "anomalies",
    },
    {
      name: "Taupymas",
      link: "savings",
    },
    {
      name: "Įžvalgos",
      link: "insights",
    },
  ];
  return (
    <div className="font-outfit sticky top-0 min-h-full max-h-screen min-w-57.5 border-2 border-(--sidebar-outline) bg-(--side-bar-bg)">
      <div className="sticky flex h-full flex-col justify-between py-6">
        <div className="">
          <div className="flex flex-col border-b-2 border-(--sidebar-outline) px-5 pb-6 text-(--text-primary-white)">
            <span className="font-playfair text-2xl">
              <span className="text-(--text-green-200)">€</span>xpense
            </span>
            <span className="text-sm font-light tracking-widest text-(--text-gray-400)">
              Pattern Detector
            </span>
          </div>
          <ul className="mt-6.5 flex flex-col gap-4 px-5">
            {links.map((el) => (
              <li
                onClick={() => setSelectedTab(el.link)}
                key={el.name}
                className={`${selectedTab === el.link ? "rounded-md border-l-3 border-(--btn-bg-green) bg-(--card-background)" : ""} py-2 pl-2`}
              >
                <Link to={el.link}>
                  <span
                    className={`${selectedTab === el.link ? "text-(--text-primary-white)" : ""} cursor-pointer text-sm font-medium text-(--label-gray-300)`}
                  >
                    {el.name}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="px-5">
          <div className="grid text-center">
            <button
              className="cursor-pointer rounded-lg bg-[rgba(52,211,153,0.10)] py-2 pl-2.5 outline-1 outline-[rgba(52,211,153,0.25)] outline-solid"
              onClick={() => navigate("import")}
            >
              <span className="text-sm font-semibold text-[#34D399]">
                Įkelti CSV
              </span>
            </button>
            <span className="mt-1.5 text-[13px] text-(--text-gray-400)">
              Swedbank · SEB · Revolut
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
