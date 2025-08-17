import React, { useMemo, useState } from "react";

/**
 * QueenB – Registration Page
 * -------------------------------------------------------
 * - RTL layout with Hebrew labels
 * - Two role buttons: Mentor / Mentee
 * - Each role opens its own form
 * - Password strength helper with live checks
 * - Phone formatter enforcing 055-1234567 pattern (or similar 0XX-XXXXXXX)
 * - Clear field labels + helper notes above selected inputs
 * - Accessible markup, minimal client-side validation
 * - Ready to POST to your backend (customize ENDPOINTS below)
 *
 * 🔧 THEME — tweak colors & spacing here (Tailwind classes)
 */
const THEME = {
  pageBg: "min-h-screen bg-gradient-to-br from-rose-50 via-white to-indigo-50", // רקע הדף
  cardBg: "bg-white", // רקע כרטיס/טופס
  text: "text-slate-800", // צבע טקסט כללי
  subtext: "text-slate-500", // טקסט משני / הערות
  border: "border-slate-200", // צבע מסגרות
  inputBg: "bg-white", // רקע שדות קלט
  inputText: "text-slate-800", // טקסט בשדות קלט
  inputPlaceholder: "placeholder-slate-400", // צבע placeholder
  inputFocus: "focus:ring-2 focus:ring-fuchsia-400 focus:border-fuchsia-400", // פוקוס על שדות
  buttonPrimary:
    "bg-fuchsia-600 hover:bg-fuchsia-700 active:bg-fuchsia-800 text-white",
  buttonSecondary:
    "bg-indigo-50 hover:bg-indigo-100 active:bg-indigo-200 text-indigo-700",
  danger: "text-rose-600",
  success: "text-emerald-600",
};

/**
 * 🔌 BACKEND ENDPOINTS — adjust to your server routes
 */
const ENDPOINTS = {
  mentor: "/api/auth/register/mentor",
  mentee: "/api/auth/register/mentee",
};

// ===================== Utilities ===================== //
const cls = (...xs) => xs.filter(Boolean).join(" ");

function formatIsraeliPhone(input) {
  const digits = (input || "").replace(/\D+/g, "");
  if (!digits) return "";
  const d = digits.slice(0, 10);
  if (d.length <= 3) return d;
  const left = d.slice(0, 3);
  const right = d.slice(3);
  return `${left}-${right}`;
}

function validateLinkedIn(url) {
  if (!url) return true;
  try {
    const u = new URL(url);
    return /(^|\.)linkedin\.com$/i.test(u.hostname);
  } catch (e) {
    return false;
  }
}

const PASSWORD_RULES = [
  { id: "len", label: "לפחות 8 תווים", test: (v) => (v || "").length >= 8 },
  {
    id: "upper",
    label: "אות גדולה אחת לפחות (A-Z)",
    test: (v) => /[A-Z]/.test(v),
  },
  {
    id: "lower",
    label: "אות קטנה אחת לפחות (a-z)",
    test: (v) => /[a-z]/.test(v),
  },
  { id: "digit", label: "ספרה אחת לפחות (0-9)", test: (v) => /\d/.test(v) },
  {
    id: "symbol",
    label: "תו מיוחד אחד לפחות (!@#$…) ",
    test: (v) => /[^\w\s]/.test(v),
  },
];

function PasswordHints({ value }) {
  const checks = useMemo(
    () => PASSWORD_RULES.map((r) => ({ ...r, ok: r.test(value) })),
    [value]
  );
  const allGood = checks.every((c) => c.ok);
  return (
    <div className="mt-2">
      <div className={cls("text-sm", allGood ? THEME.success : THEME.subtext)}>
        {allGood ? "מעולה! הסיסמה חזקה." : "המלצות לסיסמה חזקה:"}
      </div>
      <ul className="mt-1 space-y-1 text-sm">
        {checks.map((c) => (
          <li key={c.id} className={c.ok ? THEME.success : THEME.subtext}>
            {c.ok ? "✓" : "•"} {c.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Field({ id, label, required, hint, children }) {
  return (
    <div className="space-y-1">
      {hint ? (
        <div className={cls("text-xs", THEME.subtext)}>{hint}</div>
      ) : null}
      <label htmlFor={id} className={cls("block font-medium", THEME.text)}>
        {label} {required && <span className={THEME.danger}>*</span>}
      </label>
      {children}
    </div>
  );
}

function Input(props) {
  return (
    <input
      {...props}
      className={cls(
        "w-full rounded-2xl border px-4 py-3 outline-none",
        THEME.border,
        THEME.inputBg,
        THEME.inputText,
        THEME.inputPlaceholder,
        THEME.inputFocus,
        props.className
      )}
    />
  );
}

function Textarea(props) {
  return (
    <textarea
      {...props}
      className={cls(
        "w-full rounded-2xl border px-4 py-3 outline-none min-h-[96px]",
        THEME.border,
        THEME.inputBg,
        THEME.inputText,
        THEME.inputPlaceholder,
        THEME.inputFocus,
        props.className
      )}
    />
  );
}

// ======== PRESET AVATARS ========= //
export const PRESET_AVATARS = [
  "/avatars/avatar_1.png",
  "/avatars/avatar_2.png",
  "/avatars/avatar_3.png",
  "/avatars/avatar_4.png",
  "/avatars/avatar_5.png",
  "/avatars/avatar_6.png",
];

// ===================== Forms ===================== //
function MentorForm({ onSubmit, busy }) {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    password: "",
    linkedin_url: "",
    skills: "",
    years_experience: "",
    region: "",
    short_description: "",
    image_url: "",
  });
  const [errors, setErrors] = useState({});

  function set(k, v) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function handlePhone(v) {
    set("phone", formatIsraeliPhone(v));
  }

  function validate() {
    const e = {};
    if (!form.first_name) e.first_name = "שדה חובה";
    if (!form.last_name) e.last_name = "שדה חובה";
    if (!/^0\d{2}-\d{7}$/.test(form.phone))
      e.phone = "מספר לא תקין, השתמשי בתבנית 055-1234567";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email))
      e.email = "כתובת מייל לא תקינה";
    if (!PASSWORD_RULES.every((r) => r.test(form.password)))
      e.password = "השלימי את תנאי הסיסמה";
    if (!validateLinkedIn(form.linkedin_url))
      e.linkedin_url = "יש להזין כתובת LinkedIn תקינה";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function submit(e) {
    e.preventDefault();
    if (!validate()) return;
    console.log("MentorForm.validate OK, payload:", form);
    onSubmit?.(form);
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <Field label="שם פרטי" id="mentor-first" required>
        <Input
          id="mentor-first"
          value={form.first_name}
          onChange={(e) => set("first_name", e.target.value)}
          placeholder="הקלידי שם פרטי"
        />
        {errors.first_name && (
          <div className={cls("text-sm", THEME.danger)}>
            {errors.first_name}
          </div>
        )}
      </Field>
      <Field label="שם משפחה" id="mentor-last" required>
        <Input
          id="mentor-last"
          value={form.last_name}
          onChange={(e) => set("last_name", e.target.value)}
          placeholder="הקלידי שם משפחה"
        />
        {errors.last_name && (
          <div className={cls("text-sm", THEME.danger)}>{errors.last_name}</div>
        )}
      </Field>
      <Field
        label="מספר טלפון ליצירת קשר"
        id="mentor-phone"
        required
        hint={
          <span>
            אחידות תבנית מספרי טלפון: <b>055-1234567</b>
          </span>
        }
      >
        <Input
          id="mentor-phone"
          inputMode="tel"
          value={form.phone}
          onChange={(e) => handlePhone(e.target.value)}
          placeholder="055-1234567"
        />
        {errors.phone && (
          <div className={cls("text-sm", THEME.danger)}>{errors.phone}</div>
        )}
      </Field>
      <Field label="מייל" id="mentor-email" required>
        <Input
          id="mentor-email"
          type="email"
          value={form.email}
          onChange={(e) => set("email", e.target.value)}
          placeholder="name@example.com"
        />
        {errors.email && (
          <div className={cls("text-sm", THEME.danger)}>{errors.email}</div>
        )}
      </Field>
      <Field
        label="סיסמא לאתר"
        id="mentor-pass"
        required
        hint="עמדי בדרישות לסיסמה חזקה (ראו למטה)"
      >
        <Input
          id="mentor-pass"
          type="password"
          value={form.password}
          onChange={(e) => set("password", e.target.value)}
          placeholder="••••••••"
        />
        <PasswordHints value={form.password} />
        {errors.password && (
          <div className={cls("text-sm", THEME.danger)}>{errors.password}</div>
        )}
      </Field>
      <Field label="לינק ל‑LinkedIn" id="mentor-ln">
        <Input
          id="mentor-ln"
          value={form.linkedin_url}
          onChange={(e) => set("linkedin_url", e.target.value)}
          placeholder="https://www.linkedin.com/in/your-profile"
        />
        {errors.linkedin_url && (
          <div className={cls("text-sm", THEME.danger)}>
            {errors.linkedin_url}
          </div>
        )}
      </Field>
      <Field
        label="שפות תכנות / טכנולוגיות / תחומים"
        id="mentor-skills"
        hint="הפרידי בפסיקים: React, Node.js, SQL"
      >
        <Input
          id="mentor-skills"
          value={form.skills}
          onChange={(e) => set("skills", e.target.value)}
          placeholder="React, Node.js, SQL"
        />
      </Field>
      <Field label="שנות ניסיון" id="mentor-years">
        <Input
          id="mentor-years"
          value={form.years_experience}
          onChange={(e) => set("years_experience", e.target.value)}
          placeholder="5"
        />
      </Field>
      <Field label="אזור מגורים" id="mentor-region">
        <Input
          id="mentor-region"
          value={form.region}
          onChange={(e) => set("region", e.target.value)}
          placeholder="מרכז / צפון / דרום"
        />
      </Field>
      <Field label="תיאור כללי" id="mentor-about">
        <Textarea
          id="mentor-about"
          value={form.short_description}
          onChange={(e) => set("short_description", e.target.value)}
          placeholder="ספרי מעט על עצמך, תחומי עניין, זמינות ועוד"
        />
      </Field>
      <Field label="בחרי אווטר" id="mentor-avatar">
        <div className="grid grid-cols-5 gap-2">
          {PRESET_AVATARS.map((src) => (
            <button
              key={src}
              type="button"
              onClick={() => set("image_url", src)}
              className={cls(
                "rounded-xl border-2 p-1",
                form.image_url === src
                  ? "border-fuchsia-500"
                  : "border-transparent"
              )}
            >
              {" "}
              <img
                src={src}
                alt="avatar option"
                className="h-16 w-16 rounded-lg object-cover"
              />{" "}
            </button>
          ))}
        </div>
      </Field>
      <div className="pt-2">
        <button
          type="submit"
          disabled={busy}
          className={cls(
            "w-full rounded-2xl px-4 py-3 font-semibold shadow-sm",
            THEME.buttonPrimary
          )}
        >
          {busy ? "שולחת…" : "הרשמה כמנטורית"}
        </button>
      </div>
    </form>
  );
}

function MenteeForm({ onSubmit, busy }) {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    password: "",
    linkedin_url: "",
    region: "",
    short_description: "",
    image_url: "",
  });
  const [errors, setErrors] = useState({});

  function set(k, v) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function handlePhone(v) {
    set("phone", formatIsraeliPhone(v));
  }

  function validate() {
    const e = {};
    if (!form.first_name) e.first_name = "שדה חובה";
    if (!form.last_name) e.last_name = "שדה חובה";
    if (!/^0\d{2}-\d{7}$/.test(form.phone)) e.phone = "מספר לא תקין";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email))
      e.email = "כתובת מייל לא תקינה";
    if (!PASSWORD_RULES.every((r) => r.test(form.password)))
      e.password = "סיסמה לא עומדת בדרישות";
    if (!validateLinkedIn(form.linkedin_url))
      e.linkedin_url = "לינקדאין לא תקין";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function submit(e) {
    e.preventDefault();
    if (!validate()) return;
    onSubmit?.(form);
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <Field label="שם פרטי" id="mentee-first" required>
        <Input
          id="mentee-first"
          value={form.first_name}
          onChange={(e) => set("first_name", e.target.value)}
          placeholder="הקלידי שם פרטי"
        />
        {errors.first_name && (
          <div className={cls("text-sm", THEME.danger)}>
            {errors.first_name}
          </div>
        )}
      </Field>
      <Field label="שם משפחה" id="mentee-last" required>
        <Input
          id="mentee-last"
          value={form.last_name}
          onChange={(e) => set("last_name", e.target.value)}
          placeholder="הקלידי שם משפחה"
        />
        {errors.last_name && (
          <div className={cls("text-sm", THEME.danger)}>{errors.last_name}</div>
        )}
      </Field>
      <Field
        label="טלפון ליצירת קשר"
        id="mentee-phone"
        required
        hint={
          <span>
            תבנית: <b>055-1234567</b>
          </span>
        }
      >
        <Input
          id="mentee-phone"
          value={form.phone}
          onChange={(e) => handlePhone(e.target.value)}
          placeholder="055-1234567"
        />
        {errors.phone && (
          <div className={cls("text-sm", THEME.danger)}>{errors.phone}</div>
        )}
      </Field>
      <Field label="מייל" id="mentee-email" required>
        <Input
          id="mentee-email"
          type="email"
          value={form.email}
          onChange={(e) => set("email", e.target.value)}
          placeholder="name@example.com"
        />
        {errors.email && (
          <div className={cls("text-sm", THEME.danger)}>{errors.email}</div>
        )}
      </Field>{" "}
      <Field label="סיסמה" id="mentee-pass" required>
        <Input
          id="mentee-pass"
          type="password"
          value={form.password}
          onChange={(e) => set("password", e.target.value)}
          placeholder="••••••••"
        />
        <PasswordHints value={form.password} />
        {errors.password && (
          <div className={cls("text-sm", THEME.danger)}>{errors.password}</div>
        )}
      </Field>
      <Field label="לינק ל‑LinkedIn" id="mentee-ln">
        <Input
          id="mentee-ln"
          value={form.linkedin_url}
          onChange={(e) => set("linkedin_url", e.target.value)}
          placeholder="https://www.linkedin.com/in/your-profile"
        />
        {errors.linkedin_url && (
          <div className={cls("text-sm", THEME.danger)}>
            {errors.linkedin_url}
          </div>
        )}
      </Field>
      <Field label="אזור מגורים" id="mentee-region">
        <Input
          id="mentee-region"
          value={form.region}
          onChange={(e) => set("region", e.target.value)}
          placeholder="מרכז / צפון / דרום"
        />
      </Field>
      <Field label="תיאור כללי" id="mentee-about">
        <Textarea
          id="mentee-about"
          value={form.short_description}
          onChange={(e) => set("short_description", e.target.value)}
          placeholder="ספרי על עצמך, מטרות, תחומי עניין, ועוד"
        />
      </Field>
      <Field
        label="בחרי אווטר"
        id="mentee-avatar"
        hint="לחצי כדי לבחור תמונה מייצגת"
      >
        <div className="grid grid-cols-5 gap-2">
          {PRESET_AVATARS.map((src) => (
            <button
              key={src}
              type="button"
              onClick={() => set("image_url", src)}
              className={cls(
                "rounded-xl border-2 p-1",
                form.image_url === src
                  ? "border-fuchsia-500"
                  : "border-transparent"
              )}
            >
              <img
                src={src}
                alt="avatar option"
                className="h-16 w-16 rounded-lg object-cover"
              />
            </button>
          ))}
        </div>
      </Field>
      <div className="pt-2">
        <button
          type="submit"
          disabled={busy}
          className={cls(
            "w-full rounded-2xl px-4 py-3 font-semibold shadow-sm",
            THEME.buttonPrimary
          )}
        >
          {busy ? "שולחת…" : "הרשמה כמנטית"}
        </button>
      </div>
    </form>
  );
}

// ===================== Page ===================== //
function RegistrationPage() {
  const [role, setRole] = useState(null); // 'mentor' | 'mentee'
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  async function postToBackend(which, payload) {
    console.log("POST start:", which, payload);

    setLoading(true);
    setMessage(null);
    try {
      const url = which === "mentor" ? ENDPOINTS.mentor : ENDPOINTS.mentee;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (res.status === 400) throw new Error("חסרים שדות חובה");
        if (res.status === 409) throw new Error("אימייל כבר קיים במערכת");
        throw new Error(data?.error || "שגיאה בשרת");
      }
      setMessage({ type: "success", text: "נרשמת בהצלחה!" });
    } catch (err) {
      console.error("POST failed:", err);

      setMessage({ type: "error", text: err.message || "משהו השתבש, נסי שוב" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div dir="rtl" className={cls(THEME.pageBg, THEME.text)}>
      <div className="mx-auto max-w-3xl px-5 py-10">
        {/* Title */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-extrabold tracking-tight">רישום לאתר</h1>
          <p className={cls("mt-2 text-sm", THEME.subtext)}>
            בחרי את סוג המשתמשה כדי לפתוח את הטופס המתאים.
          </p>
        </div>

        {/* Role Buttons */}
        <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => setRole("mentor")}
            className={cls(
              "w-full rounded-2xl px-5 py-4 text-center text-base font-semibold shadow-sm",
              role === "mentor" ? THEME.buttonPrimary : THEME.buttonSecondary
            )}
          >
            אני מנטורית
          </button>
          <button
            type="button"
            onClick={() => setRole("mentee")}
            className={cls(
              "w-full rounded-2xl px-5 py-4 text-center text-base font-semibold shadow-sm",
              role === "mentee" ? THEME.buttonPrimary : THEME.buttonSecondary
            )}
          >
            אני מנטית
          </button>
        </div>

        {/* Card */}
        <div
          className={cls(
            "rounded-3xl border p-6 shadow-sm",
            THEME.cardBg,
            THEME.border
          )}
        >
          {!role ? (
            <div className={cls("text-center", THEME.subtext)}>
              לחצי על אחד הכפתורים למעלה כדי להתחיל רישום.
            </div>
          ) : role === "mentor" ? (
            <MentorForm
              busy={loading}
              onSubmit={(payload) => postToBackend("mentor", payload)}
            />
          ) : (
            <MenteeForm
              busy={loading}
              onSubmit={(payload) => postToBackend("mentee", payload)}
            />
          )}

          {message && (
            <div
              className={cls(
                "mt-6 rounded-2xl px-4 py-3 text-sm",
                message.type === "success"
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-rose-50 text-rose-700"
              )}
            >
              {message.text}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RegistrationPage;
