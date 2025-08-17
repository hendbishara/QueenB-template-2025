import React, { useMemo, useState, useRef, useEffect } from "react";
// If you plan to redirect after successful registration, uncomment the next line
// and make sure react-router-dom is installed + Router is set up in your app.
// import { useNavigate } from "react-router-dom";

/**
 * QueenB – Registration Page (EN, LTR)
 * -------------------------------------------------------
 * ✔ All labels/placeholders in English
 * ✔ LTR layout
 * ✔ Helper text example appears under the label
 * ✔ Input sits directly under the label (with helper under label)
 * ✔ Smaller avatar options
 * ✔ Big prominent submit button for each role
 * ✔ Centered card and controls
 * ✔ Stronger validation UX (inline errors + auto-scroll to first error)
 * ✔ Mentor-only required: "Programming Languages / Tech" and "Years of Experience"
 * ✔ Skills normalization to Title Case per word (frontend) + note to also enforce on backend
 * ✔ Post-success: place for redirect to /login (commented TODO)
 */

// ===================== THEME ===================== //
const THEME = {
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

// ===================== BACKEND ENDPOINTS ===================== //
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

function toTitleCasePerWordCSV(input) {
  if (!input) return "";
  return input
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) =>
      item
        .split(/\s+/)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(" ")
    )
    .join(", ");
}

const PASSWORD_RULES = [
  {
    id: "len",
    label: "At least 8 characters",
    test: (v) => (v || "").length >= 8,
  },
  {
    id: "upper",
    label: "At least one uppercase (A-Z)",
    test: (v) => /[A-Z]/.test(v),
  },
  {
    id: "lower",
    label: "At least one lowercase (a-z)",
    test: (v) => /[a-z]/.test(v),
  },
  { id: "digit", label: "At least one digit (0-9)", test: (v) => /\d/.test(v) },
  {
    id: "symbol",
    label: "At least one special character (!@#$…)",
    test: (v) => /[^\w\s]/.test(v),
  },
];
/*
function toTitleCaseWordsCSV(input) {
  if (!input) return "";
  return input
    .split(",")
    .map((w) => w.trim())
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(", ");
}
    */

function PasswordHints({ value }) {
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

function Field({ id, label, required, hint, children, error }) {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className={cls("block font-medium", THEME.text)}>
        {label} {required && <span className={THEME.danger}>*</span>}
      </label>
      {hint ? (
        <div className={cls("text-xs", THEME.subtext)}>{hint}</div>
      ) : null}
      {children}
      {error ? (
        <div className={cls("text-sm", THEME.danger)}>{error}</div>
      ) : null}
    </div>
  );
}
function Input(props) {
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

function Textarea(props) {
  return (
    <textarea
      {...props}
      className={cls(
        "w-full rounded-2xl ring-1 ring-pink-200 px-4 py-3 outline-none min-h-[96px] shadow-sm",
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

// =============== Shared Hooks =============== //
function useFirstErrorScroll() {
  const errorRef = useRef(null);
  useEffect(() => {
    if (errorRef.current) {
      errorRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, []);
  return errorRef;
}

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
  const firstErrorRef = useFirstErrorScroll();

  function set(k, v) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function handlePhone(v) {
    set("phone", formatIsraeliPhone(v));
  }

  function handleSkillsChange(v) {
    // מאפשר כתיבה חופשית עם פסיקים ורווחים; נירמול יתבצע ב-onBlur
    set("skills", v);
  }

  function validate() {
    const e = {};
    if (!form.first_name) e.first_name = "Required";
    if (!form.last_name) e.last_name = "Required";
    if (!/^0\d{2}-\d{7}$/.test(form.phone))
      e.phone = "Invalid format. Use 055-1234567";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email))
      e.email = "Invalid email";
    if (!PASSWORD_RULES.every((r) => r.test(form.password)))
      e.password = "Password does not meet the rules";
    if (!validateLinkedIn(form.linkedin_url))
      e.linkedin_url = "Please enter a valid LinkedIn URL";
    // Mentor-only required fields
    if (!form.skills) e.skills = "Required (comma-separated)";
    if (!form.years_experience) e.years_experience = "Required";
    setErrors(e);
    return e;
  }

  function submit(e) {
    e.preventDefault();
    const eMap = validate();
    if (Object.keys(eMap).length > 0) return; // block
    onSubmit?.(form);
  }

  // locate first error field for auto-scroll
  useEffect(() => {
    const firstKey = Object.keys(errors)[0];
    if (!firstKey) return;
    const node = document.getElementById(`mentor-${firstKey}`);
    if (node) node.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [errors]);

  return (
    <form onSubmit={submit} className="space-y-5" noValidate>
      <Field
        label="First Name"
        id="mentor-first_name"
        required
        error={errors.first_name}
      >
        <Input
          id="mentor-first_name"
          value={form.first_name}
          onChange={(e) => set("first_name", e.target.value)}
          placeholder="Enter first name"
          aria-invalid={!!errors.first_name}
        />
      </Field>

      <Field
        label="Last Name"
        id="mentor-last_name"
        required
        error={errors.last_name}
      >
        <Input
          id="mentor-last_name"
          value={form.last_name}
          onChange={(e) => set("last_name", e.target.value)}
          placeholder="Enter last name"
          aria-invalid={!!errors.last_name}
        />
      </Field>

      <Field
        label="Phone Number"
        id="mentor-phone"
        required
        hint={
          <span>
            Format: <b>055-1234567</b>
          </span>
        }
        error={errors.phone}
      >
        <Input
          id="mentor-phone"
          inputMode="tel"
          value={form.phone}
          onChange={(e) => handlePhone(e.target.value)}
          placeholder="055-1234567"
          aria-invalid={!!errors.phone}
        />
      </Field>

      <Field label="Email" id="mentor-email" required error={errors.email}>
        <Input
          id="mentor-email"
          type="email"
          value={form.email}
          onChange={(e) => set("email", e.target.value)}
          placeholder="name@example.com"
          aria-invalid={!!errors.email}
        />
      </Field>

      <Field
        label="Password"
        id="mentor-password"
        required
        hint="Meet the strong password rules (see below)"
        error={errors.password}
      >
        <Input
          id="mentor-password"
          type="password"
          value={form.password}
          onChange={(e) => set("password", e.target.value)}
          placeholder="••••••••"
          aria-invalid={!!errors.password}
        />
        <PasswordHints value={form.password} />
      </Field>

      <Field
        label="Programming Languages / Tech"
        id="mentor-skills"
        required
        hint="Comma-separated: React, Node.js, SQL"
        error={errors.skills}
      >
        <Input
          id="mentor-skills"
          value={form.skills}
          onChange={(e) => handleSkillsChange(e.target.value)}
          onBlur={(e) => set("skills", toTitleCasePerWordCSV(e.target.value))}
          placeholder="SQL, Front End, React"
          aria-invalid={!!errors.skills}
        />
      </Field>

      <Field
        label="Years of Experience"
        id="mentor-years_experience"
        required
        error={errors.years_experience}
      >
        <Input
          id="mentor-years_experience"
          value={form.years_experience}
          onChange={(e) => set("years_experience", e.target.value)}
          placeholder="5"
          aria-invalid={!!errors.years_experience}
        />
      </Field>

      <Field
        label="LinkedIn URL"
        id="mentor-linkedin_url"
        hint="Example: https://www.linkedin.com/in/your-profile"
        error={errors.linkedin_url}
      >
        <Input
          id="mentor-linkedin_url"
          value={form.linkedin_url}
          onChange={(e) => set("linkedin_url", e.target.value)}
          placeholder="https://www.linkedin.com/in/your-profile"
          aria-invalid={!!errors.linkedin_url}
        />
      </Field>

      <Field
        label="Region"
        id="mentor-region"
        hint="e.g., North / South / Center / Remote"
      >
        <Input
          id="mentor-region"
          value={form.region}
          onChange={(e) => set("region", e.target.value)}
          placeholder="Center"
        />
      </Field>

      <Field label="About" id="mentor-short_description">
        <Textarea
          id="mentor-short_description"
          value={form.short_description}
          onChange={(e) => set("short_description", e.target.value)}
          placeholder="Tell us about yourself, interests, availability, etc."
        />
      </Field>

      <Field
        label="Choose an Avatar"
        id="mentor-avatar"
        hint="Click to select a profile image"
      >
        <div className="grid grid-cols-8 gap-2">
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
              aria-pressed={form.image_url === src}
            >
              <img
                src={src}
                alt="avatar option"
                className="h-10 w-10 rounded-lg object-cover"
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
            "w-full rounded-3xl px-8 py-6 text-xl font-extrabold shadow-sm tracking-wide",
            THEME.buttonPrimary
          )}
          ref={Object.keys(errors).length ? firstErrorRef : null}
        >
          {busy ? "Submitting…" : "Register as Mentor"}
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
  const firstErrorRef = useFirstErrorScroll();

  function set(k, v) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function handlePhone(v) {
    set("phone", formatIsraeliPhone(v));
  }

  function validate() {
    const e = {};
    if (!form.first_name) e.first_name = "Required";
    if (!form.last_name) e.last_name = "Required";
    if (!/^0\d{2}-\d{7}$/.test(form.phone))
      e.phone = "Invalid format. Use 055-1234567";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email))
      e.email = "Invalid email";
    if (!PASSWORD_RULES.every((r) => r.test(form.password)))
      e.password = "Password does not meet the rules";
    if (!validateLinkedIn(form.linkedin_url))
      e.linkedin_url = "Please enter a valid LinkedIn URL";
    setErrors(e);
    return e;
  }

  function submit(e) {
    e.preventDefault();
    const eMap = validate();
    if (Object.keys(eMap).length > 0) return;
    onSubmit?.(form);
  }

  useEffect(() => {
    const firstKey = Object.keys(errors)[0];
    if (!firstKey) return;
    const node = document.getElementById(`mentee-${firstKey}`);
    if (node) node.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [errors]);

  return (
    <form onSubmit={submit} className="space-y-5" noValidate>
      <Field
        label="First Name"
        id="mentee-first_name"
        required
        error={errors.first_name}
      >
        <Input
          id="mentee-first_name"
          value={form.first_name}
          onChange={(e) => set("first_name", e.target.value)}
          placeholder="Enter first name"
          aria-invalid={!!errors.first_name}
        />
      </Field>

      <Field
        label="Last Name"
        id="mentee-last_name"
        required
        error={errors.last_name}
      >
        <Input
          id="mentee-last_name"
          value={form.last_name}
          onChange={(e) => set("last_name", e.target.value)}
          placeholder="Enter last name"
          aria-invalid={!!errors.last_name}
        />
      </Field>

      <Field
        label="Phone Number"
        id="mentee-phone"
        required
        hint={
          <span>
            Format: <b>055-1234567</b>
          </span>
        }
        error={errors.phone}
      >
        <Input
          id="mentee-phone"
          value={form.phone}
          onChange={(e) => handlePhone(e.target.value)}
          placeholder="055-1234567"
          aria-invalid={!!errors.phone}
        />
      </Field>

      <Field label="Email" id="mentee-email" required error={errors.email}>
        <Input
          id="mentee-email"
          type="email"
          value={form.email}
          onChange={(e) => set("email", e.target.value)}
          placeholder="name@example.com"
          aria-invalid={!!errors.email}
        />
      </Field>

      <Field
        label="Password"
        id="mentee-password"
        required
        hint="Meet the strong password rules (see below)"
        error={errors.password}
      >
        <Input
          id="mentee-password"
          type="password"
          value={form.password}
          onChange={(e) => set("password", e.target.value)}
          placeholder="••••••••"
          aria-invalid={!!errors.password}
        />
        <PasswordHints value={form.password} />
      </Field>

      <Field
        label="LinkedIn URL"
        id="mentee-linkedin_url"
        hint="Example: https://www.linkedin.com/in/your-profile"
        error={errors.linkedin_url}
      >
        <Input
          id="mentee-linkedin_url"
          value={form.linkedin_url}
          onChange={(e) => set("linkedin_url", e.target.value)}
          placeholder="https://www.linkedin.com/in/your-profile"
          aria-invalid={!!errors.linkedin_url}
        />
      </Field>

      <Field
        label="Region"
        id="mentee-region"
        hint="e.g., North / South / Center / Remote"
      >
        <Input
          id="mentee-region"
          value={form.region}
          onChange={(e) => set("region", e.target.value)}
          placeholder="Center"
        />
      </Field>

      <Field label="About" id="mentee-short_description">
        <Textarea
          id="mentee-short_description"
          value={form.short_description}
          onChange={(e) => set("short_description", e.target.value)}
          placeholder="Tell us about yourself, goals, interests, etc."
        />
      </Field>

      <Field
        label="Choose an Avatar"
        id="mentee-avatar"
        hint="Click to select a profile image"
      >
        <div className="grid grid-cols-8 gap-2">
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
              aria-pressed={form.image_url === src}
            >
              <img
                src={src}
                alt="avatar option"
                className="h-10 w-10 rounded-lg object-cover"
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
            "w-full rounded-3xl px-8 py-6 text-xl font-extrabold shadow-sm tracking-wide",
            THEME.buttonPrimary
          )}
          ref={Object.keys(errors).length ? firstErrorRef : null}
        >
          {busy ? "Submitting…" : "Register as Mentee"}
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
  // const navigate = useNavigate(); // ← uncomment when login route exists

  async function postToBackend(which, payload) {
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
        if (res.status === 400) throw new Error("Missing required fields");
        if (res.status === 409) throw new Error("Email already exists");
        throw new Error(data?.error || "Server error");
      }
      setMessage({ type: "success", text: "Registration successful!" });

      // TODO: When Login page is ready, redirect here
      // navigate("/login");
    } catch (err) {
      setMessage({
        type: "error",
        text: err.message || "Something went wrong, try again",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div dir="ltr" className={cls(THEME.pageBg, THEME.text)}>
      <div className="mx-auto w-full max-w-xl">
        {/* Title */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-extrabold tracking-tight">Sign Up</h1>
          <p className={cls("mt-2 text-sm", THEME.subtext)}>
            Choose your role to open the relevant form.
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
            I am a Mentor
          </button>
          <button
            type="button"
            onClick={() => setRole("mentee")}
            className={cls(
              "w-full rounded-2xl px-5 py-4 text-center text-base font-semibold shadow-sm",
              role === "mentee" ? THEME.buttonPrimary : THEME.buttonSecondary
            )}
          >
            I am a Mentee
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
              Click one of the buttons above to start the registration.
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
