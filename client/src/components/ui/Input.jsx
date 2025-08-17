import { THEME, cls } from "../../lib/theme";

export default function Input(props) {
  return (
    <input
      {...props}
      className={cls(
        "w-full rounded-xl border px-4 py-3 outline-none",
        THEME.border,
        THEME.inputBg,
        THEME.inputText,
        THEME.inputPlaceholder,
        THEME.inputFocus,
        props["aria-invalid"] ? "border-rose-400 ring-1 ring-rose-300" : ""
      )}
    />
  );
}
