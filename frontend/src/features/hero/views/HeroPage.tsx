import { useNavigate } from "react-router";
import NavBar from "../components/NavBar";
import { FaCircleCheck, FaArrowRightLong, FaPlay } from "react-icons/fa6";
export const HeroPage = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-hero-page-bg h-screen w-screen">
      <NavBar />
      <main className="">
        <div className="mx-auto grid max-w-7xl grid-cols-2 pt-22">
          <div className="">
            <h1 className="font-poppins max-w-[20ch] text-[50px] font-semibold">
              Automatiškai aptinka neįprastas išlaidas,{" "}
              <span className="text-hero-accent">
                pasikartojančias prenumeratas ir išlaidų įpročius.
              </span>
            </h1>
            <p className="text-[1.0625rem]] text-hero-text-muted mt-5 max-w-[40ch] leading-[1.65]">
              Driftlytics randa pasikartojančius mokesčius, anomalijas ir tylius
              biudžeto nutekėjimus, kurių nepastebite kasdien.
            </p>
            <div className="mt-8 flex flex-col items-start gap-3">
              <button className="border-hero-control-border flex cursor-pointer items-center gap-2.25 rounded-[0.6875rem] border px-5.5 py-3.5 font-semibold text-white [background:var(--hero-button-accent-bg)]">
                Pradėti nemokamai
                <FaArrowRightLong />
              </button>
              <button className="bg-color-hero-card-bg border-hero-control-border flex cursor-pointer items-center gap-2.25 rounded-[0.6875rem] border px-5.5 py-3.5" onClick={() => navigate("/dashboard/preview")}>
                <div className="bg-hero-accent-soft-bg flex h-5 w-5 items-center justify-center rounded-full font-medium">
                  <FaPlay color="#2ee6a0" size={8} />
                </div>
                Demo be registracijos
              </button>
            </div>
            <ul className="mt-12 flex flex-col gap-2.5">
              <li className="text-hero-text-bullet flex items-center gap-2.5 text-[14px]">
                <FaCircleCheck color="#2ee6a0" />
                Veikia su Swedbank, SEB ir Revolut išrašais
              </li>
              <hr />
              <li className="text-hero-text-bullet flex items-center gap-2.5 text-[14px]">
                <FaCircleCheck color="#2ee6a0" />
                Duomenys apdorojami lokaliai ir lieka jūsų
              </li>
              <hr />
              <li className="text-hero-text-bullet flex items-center gap-2.5 text-[14px]">
                <FaCircleCheck color="#2ee6a0" />
                Nuo CSV iki įžvalgų per 30 sekundžių
              </li>
              <hr />
            </ul>
          </div>
          <div className="">
            <img src="src/assets/dashboardImg.png" alt="" />
          </div>
        </div>
      </main>
    </div>
  );
};
