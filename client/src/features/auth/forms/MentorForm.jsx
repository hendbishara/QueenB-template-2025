import { useEffect, useRef, useState } from "react";
import BaseUserFields from "./BaseUserFields";
import Field from "../../../components/ui/Field";
import Input from "../../../components/ui/Input";
import { THEME, cls } from "../../../lib/theme";
import { validateLinkedIn, PASSWORD_RULES } from "../../../lib/validation";
import { formatIsraeliPhone, toTitleCasePerWordCSV } from "../../../lib/utils";

function useFirstErrorScroll() {
  const errorRef = useRef(null);
  useEffect(() => {
    if (errorRef.current)
      errorRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);
  return errorRef;
}

export default function MentorForm({ onSubmit, busy }) {
  const MIN_ABOUT = 30;
  const MAX_ABOUT = 500;

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

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const handlePhone = (v) => set("phone", formatIsraeliPhone(v));

  function validate() {
    const e = {};
    if (!form.first_name) e.first_name = "Required";
    if (!form.last_name) e.last_name = "Required";
    if (!/^0\d{2}-\d{7}$/.test(form.phone))
      e.phone = "Invalid format. Use 05X-XXXXXXX";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email))
      e.email = "Invalid email";
    if (!PASSWORD_RULES.every((r) => r.test(form.password)))
      e.password = "Password does not meet the rules";
    if (!validateLinkedIn(form.linkedin_url))
      e.linkedin_url = "Please enter a valid LinkedIn URL";

    // Mentor-only required:
    if (!form.skills) e.skills = "Required (comma-separated)";
    if (!form.years_experience) e.years_experience = "Required";

    if ((form.short_description || "").length < MIN_ABOUT)
      e.short_description = `Please write at least ${MIN_ABOUT} characters`;

    setErrors(e);
    return e;
  }

  useEffect(() => {
    const firstKey = Object.keys(errors)[0];
    if (!firstKey) return;
    const node = document.getElementById(`mentor-${firstKey}`);
    if (node) node.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [errors]);

  function submit(e) {
    e.preventDefault();
    const eMap = validate();
    if (Object.keys(eMap).length > 0) return;
    onSubmit?.(form);
  }

  return (
    <form onSubmit={submit} className="space-y-5" noValidate>
      <BaseUserFields
        idPrefix="mentor"
        form={form}
        errors={errors}
        set={set}
        onPhoneChange={handlePhone}
        showAboutCounter
        maxAbout={MAX_ABOUT}
      />

      {/* Mentor-only fields */}
      <Field
        label="Programming Languages / Tech"
        id="mentor-skills"
        required
        hint="Comma-separated: React, Node.js, Sql"
        error={errors.skills}
      >
        <Input
          id="mentor-skills"
          value={form.skills}
          onChange={(e) => set("skills", e.target.value)}
          onBlur={(e) => set("skills", toTitleCasePerWordCSV(e.target.value))}
          placeholder="Sql, Java, React, C++"
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
          placeholder="e.g., 5"
          aria-invalid={!!errors.years_experience}
        />
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
