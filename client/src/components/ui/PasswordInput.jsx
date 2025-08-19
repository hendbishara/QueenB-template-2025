import { useState } from "react";
import { THEME, cls } from "../../lib/theme";

export default function PasswordInput({
  id,
  value,
  onChange,
  placeholder,
  invalid,
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input
        id={id}
        type={show ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder || "••••••••"}
        className={cls(
          "w-full rounded-xl border px-4 py-3 pr-11 outline-none",
          THEME.border,
          THEME.inputBg,
          THEME.inputText,
          THEME.inputPlaceholder,
          THEME.inputFocus,
          invalid ? "border-rose-400 ring-1 ring-rose-300" : ""
        )}
        aria-invalid={!!invalid}
        autoComplete="new-password"
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
        aria-label={show ? "Hide password" : "Show password"}
      >
        {/* אייקון פשוט ב-SVG כדי שלא תלוי ב-MUI */}
        {show ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M3 3l18 18" stroke="currentColor" strokeWidth="2" />
            <path
              d="M10.58 6.14A10.47 10.47 0 0121 12c-1.8 3.5-5.5 6-9.5 6-1.3 0-2.6-.25-3.76-.72M6.2 6.2A10.5 10.5 0 003 12c1.8 3.5 5.5 6 9.5 6 1.6 0 3.1-.33 4.46-.94"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"
              stroke="currentColor"
              strokeWidth="2"
            />
            <circle
              cx="12"
              cy="12"
              r="3"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
        )}
      </button>
    </div>
  );
}
