import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDateISO = (date: Date) => {
  return date.toLocaleDateString("en-CA");
};

export const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");

  return `${year}-${month}`;
};

export const capitalize = (word: String | null | undefined) => {
  if (!word) return "";
  return word.charAt(0).toUpperCase() + word.slice(1);
};

export const colors: Record<string, string> = {
  maistas: "bg-orange-500/20 text-orange-400",
  būstas: "bg-purple-500/20 text-purple-400",
  transportas: "bg-blue-500/20 text-blue-400",
  pervedimai: "bg-gray-500/20 text-gray-400",
  pramogos: "bg-pink-500/20 text-pink-400",
  sveikata: "bg-red-500/20 text-red-400",
  investavimas: "bg-green-500/20 text-green-400",
  "kitos išlaidos": "bg-zinc-500/20 text-zinc-400",
  išsilavinimas: "bg-sky-500/20 text-sky-400",
  kelionės: "bg-teal-500/20 text-teal-400",
  draudimas: "bg-yellow-500/20 text-yellow-400",
  apsipirkimas: "bg-rose-500/20 text-rose-400",
};
