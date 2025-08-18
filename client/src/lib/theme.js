export const THEME = {
  pageBg:
    "min-h-screen bg-gradient-to-b from-pink-50 via-rose-50 to-pink-100 flex items-center justify-center p-6",
  cardBg: "bg-white",
  text: "text-slate-800",
  subtext: "text-slate-500",
  border: "border-pink-200",
  inputBg: "bg-white",
  inputText: "text-slate-800",
  inputPlaceholder: "placeholder-slate-400",
  inputFocus: "focus:ring-2 focus:ring-pink-400 focus:border-pink-400",
  buttonPrimary: "bg-pink-500 hover:bg-pink-600 active:bg-pink-700 text-white",
  buttonSecondary:
    "bg-rose-50 hover:bg-rose-100 active:bg-rose-200 text-rose-700",
  danger: "text-rose-600",
  success: "text-emerald-600",
};

export const cls = (...xs) => xs.filter(Boolean).join(" ");

export function roleBtnClasses(active) {
  return cls(
    "w-full rounded-2xl px-6 py-4 text-base font-semibold transition shadow-md border-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-400",
    active
      ? "bg-pink-600 text-white border-pink-700 shadow-lg"
      : "bg-white text-pink-700 border-pink-300 hover:border-pink-400 hover:bg-rose-50"
  );
}
