// src/components/forms/ImagePicker.jsx
import React, { useRef, useState } from "react";
import Input from "../ui/Input"; // עדכני נתיב אם צריך
import { cls } from "../../lib/theme"; // עדכני נתיב אם צריך

export default function ImagePicker({
  value,
  onChange,
  presetAvatars = [],
  maxSizeMB = 2,
  selectedClass = "border-fuchsia-500", // pink border for selected avatar
}) {
  const fileRef = useRef(null);
  const [urlInput, setUrlInput] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > maxSizeMB * 1024 * 1024) {
      alert(`File too large (max ${maxSizeMB}MB)`);
      e.target.value = "";
      return;
    }
    if (!file.type.startsWith("image/")) {
      alert("Please choose an image file");
      e.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => onChange(reader.result); // Base64 -> form.image_url
    reader.readAsDataURL(file);
  };

  const handleUseUrl = () => {
    const trimmed = urlInput.trim();
    if (!trimmed) return;
    try {
      new URL(trimmed);
      onChange(trimmed); // URL -> form.image_url
      setUrlInput("");
    } catch {
      alert("Invalid URL");
    }
  };

  return (
    <div className="space-y-3">
      {/* Preview + Upload */}
      <div className="flex items-center gap-3">
        <img
          src={value}
          alt="preview"
          className="h-20 w-20 rounded-full object-cover border"
          onError={(e) => {
            e.currentTarget.src =
              "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80'><rect width='100%' height='100%' fill='%23eee'/></svg>";
          }}
        />
        <button
          type="button"
          className="rounded-xl border px-3 py-1 hover:bg-slate-50"
          onClick={() => fileRef.current?.click()}
          aria-label="Upload from computer"
        >
          Upload from computer
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {/* Paste URL */}
      <div className="flex items-center gap-2">
        <Input
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          placeholder="Paste image URL"
          aria-label="Paste image URL"
        />
        <button
          type="button"
          className="rounded-xl border px-3 py-1 hover:bg-slate-50"
          onClick={handleUseUrl}
        >
          Use URL
        </button>
      </div>

      {/* Preset avatars grid + pink border on selected */}
      {presetAvatars.length > 0 && (
        <div className="grid grid-cols-8 gap-2">
          {presetAvatars.map((src) => (
            <button
              key={src}
              type="button"
              onClick={() => onChange(src)}
              className={cls(
                "rounded-xl border-2 p-1",
                value === src ? selectedClass : "border-transparent"
              )}
              aria-pressed={value === src}
            >
              <img
                src={src}
                alt="avatar option"
                className="h-18 w-18 rounded-lg object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
