import { THEME, cls } from "../../lib/theme";

export default function Field({ id, label, required, hint, children, error }) {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className={cls("block font-medium", THEME.text)}>
        {label} {required && <span className={THEME.danger}>*</span>}
      </label>
      {hint ? (
        <div className={cls("text-xs", THEME.subtext)}>{hint}</div>
      ) : null}
      {children}
      {error && <div className={cls("text-sm", THEME.danger)}>{error}</div>}
    </div>
  );
}
