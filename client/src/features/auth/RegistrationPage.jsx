import { useEffect, useState } from "react"; // CHANGED: added useEffect
import { useNavigate } from "react-router-dom";
import { THEME, cls, roleBtnClasses } from "../../lib/theme";
import MentorForm from "./forms/MentorForm";
import MenteeForm from "./forms/MenteeForm";

const ENDPOINTS = {
  mentor: "/api/auth/register/mentor",
  mentee: "/api/auth/register/mentee",
};

// כמה זמן להראות את ההודעה לפני מעבר ל-login (במילישניות)
const REDIRECT_MS = 6000; // CHANGED: longer display time

export default function RegistrationPage() {
  const [role, setRole] = useState(null); // 'mentor' | 'mentee'
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [redirectTimeoutId, setRedirectTimeoutId] = useState(null); // CHANGED
  const navigate = useNavigate();

  useEffect(() => {
    // CHANGED: ניקוי טיימר אם יוצאים מהעמוד/משנים הודעה
    return () => {
      if (redirectTimeoutId) clearTimeout(redirectTimeoutId);
    };
  }, [redirectTimeoutId]);

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

      // CHANGED: טקסט ברור + גלילה לראש המסך + טיימר ארוך יותר
      setMessage({
        type: "success",
        text: "Registration successful! Redirecting to the login page so you can sign in.",
      });
      window.scrollTo({ top: 0, behavior: "smooth" });

      const id = setTimeout(() => {
        navigate("/login", {
          replace: true,
          state: { justRegistered: true, email: payload?.email, role: which },
        });
      }, REDIRECT_MS);
      setRedirectTimeoutId(id);
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
      {/* CHANGED: באנר גדול, בולט, קבוע למעלה, בלי כפתורים */}
      {message && (
        <div className="fixed top-0 inset-x-0 z-50">
          <div
            className={cls(
              "mx-auto max-w-4xl rounded-b-3xl shadow-xl border",
              message.type === "success"
                ? "bg-pink-600 border-pink-700 text-white" // <-- ורוד להצלחה
                : "bg-rose-600 border-rose-700 text-white"
            )}
            role="status"
            aria-live="polite"
          >
            <div className="px-6 py-5">
              <div className="text-2xl font-extrabold tracking-tight">
                {message.type === "success"
                  ? "Registration Successful"
                  : "Notice"}
              </div>
              <p className="mt-1 text-base md:text-lg opacity-95">
                {message.type === "success"
                  ? "Redirecting to the login page so you can sign in…"
                  : message.text}
              </p>
              {message.type !== "success" && (
                <p className="sr-only">{message.text}</p>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto w-full max-w-xl -mt-32">
        <div className="flex justify-center mb-4">
          <img
            src="/logo.png"
            alt="Queens Match Logo"
            className="h-24 w-auto drop-shadow-sm"
          />
        </div>

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

            {/* אפשר למחוק את הבלוק הישן של message כאן כדי שלא יכפיל תצוגה */}
            {/* השארתי הערה כדי לזכור למה */}
          </div>
        )}
      </div>
    </div>
  );
}
