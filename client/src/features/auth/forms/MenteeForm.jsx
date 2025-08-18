import { useEffect, useRef, useState } from "react";
import BaseUserFields from "./BaseUserFields";
import { THEME, cls } from "../../../lib/theme";
import { validateLinkedIn, PASSWORD_RULES } from "../../../lib/validation";
import { formatIsraeliPhone } from "../../../lib/utils";

function useFirstErrorScroll() {
  const errorRef = useRef(null);
  useEffect(() => {
    if (errorRef.current)
      errorRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);
  return errorRef;
}

export default function MenteeForm({ onSubmit, busy }) {
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
    setErrors(e);
    return e;
  }

  useEffect(() => {
    const firstKey = Object.keys(errors)[0];
    if (!firstKey) return;
    const node = document.getElementById(`mentee-${firstKey}`);
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
        idPrefix="mentee"
        form={form}
        errors={errors}
        set={set}
        onPhoneChange={handlePhone}
        showAboutCounter={false} // למנטית – בלי חובה של מינימום תווים
      />

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
