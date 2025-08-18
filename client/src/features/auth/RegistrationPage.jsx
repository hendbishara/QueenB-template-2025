import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { THEME, cls, roleBtnClasses } from "../../lib/theme";
import MentorForm from "./forms/MentorForm";
import MenteeForm from "./forms/MenteeForm";

const ENDPOINTS = {
  mentor: "/api/auth/register/mentor",
  mentee: "/api/auth/register/mentee",
};

export default function RegistrationPage() {
  const [role, setRole] = useState(null); // 'mentor' | 'mentee'
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

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
      //navigating to login
      setTimeout(() => {
       navigate("/login", {
         replace: true,
         state: { justRegistered: true, email: payload?.email, role: which },
       });
     }, 1000);

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
            className={roleBtnClasses(role === "mentor")}
            aria-pressed={role === "mentor"}
          >
            I am a Mentor 👩‍🏫
          </button>
          <button
            type="button"
            onClick={() => setRole("mentee")}
            className={roleBtnClasses(role === "mentee")}
            aria-pressed={role === "mentee"}
          >
            I am a Mentee 🎓
          </button>
        </div>

        {/* Helper text or form card */}
        {!role && (
          <p className="text-center text-sm text-slate-500">
            Click one of the buttons above to start the registration.
          </p>
        )}

        {role && (
          <div
            className={cls(
              "mt-4 rounded-3xl border p-6 shadow-sm",
              THEME.cardBg,
              THEME.border
            )}
          >
            {role === "mentor" ? (
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
        )}
      </div>
    </div>
  );
}
