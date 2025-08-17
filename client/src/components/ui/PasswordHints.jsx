import { useMemo } from "react";
import { PASSWORD_RULES } from "../../lib/validation";
import { THEME, cls } from "../../lib/theme";

export default function PasswordHints({ value }) {
  const checks = useMemo(
    () => PASSWORD_RULES.map((r) => ({ ...r, ok: r.test(value) })),
    [value]
  );
  const allGood = checks.every((c) => c.ok);

  return (
    <div className="mt-2">
      <div className={cls("text-sm", allGood ? THEME.success : THEME.subtext)}>
        {allGood ? "Great! Strong password." : "Tips for a stronger password:"}
      </div>
      <ul className="mt-1 space-y-1 text-sm">
        {checks.map((c) => (
          <li
            key={c.id}
            className={cls(
              "flex items-center gap-1",
              c.ok ? THEME.success : THEME.subtext
            )}
          >
            {c.ok ? (
              <span className="text-emerald-600">✓</span>
            ) : (
              <span>•</span>
            )}
            <span>{c.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
