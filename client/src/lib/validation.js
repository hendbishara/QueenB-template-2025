export function validateLinkedIn(url) {
  if (!url) return true;
  try {
    const u = new URL(url);
    return /(^|\.)linkedin\.com$/i.test(u.hostname);
  } catch {
    return false;
  }
}

export const PASSWORD_RULES = [
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
