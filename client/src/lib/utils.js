export function formatIsraeliPhone(input) {
  const digits = (input || "").replace(/\D+/g, "");
  if (!digits) return "";
  const d = digits.slice(0, 10);
  if (d.length <= 3) return d;
  const left = d.slice(0, 3);
  const right = d.slice(3);
  return `${left}-${right}`;
}

export function toTitleCasePerWordCSV(input) {
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
