import Field from "../../../components/ui/Field";
import Input from "../../../components/ui/Input";
import Textarea from "../../../components/ui/Textarea";
import PasswordHints from "../../../components/ui/PasswordHints";
import PasswordInput from "../../../components/ui/PasswordInput";
import { PRESET_AVATARS } from "../../../data/avatars";
import { THEME, cls } from "../../../lib/theme";
import ImagePicker from "../../../components/forms/ImagePicker";

/**
 * שדות משותפים לשני התפקידים.
 * idPrefix מאפשר לשמור על מזהים שונים (mentor- / mentee-) בשביל auto-scroll.
 * אפשר לשלוט בהצגת מונה תווים ע"י showAboutCounter + maxAbout.
 */
export default function BaseUserFields({
  idPrefix = "user",
  form,
  errors,
  set, // (k, v) => void
  onPhoneChange, // (val) => void
  showAboutCounter = false,
  maxAbout = 500,
  aboutHintText,
}) {
  return (
    <>
      <Field
        label="First Name"
        id={`${idPrefix}-first_name`}
        required
        error={errors.first_name}
      >
        <Input
          id={`${idPrefix}-first_name`}
          value={form.first_name}
          onChange={(e) => set("first_name", e.target.value)}
          placeholder="Enter first name"
          aria-invalid={!!errors.first_name}
        />
      </Field>

      <Field
        label="Last Name"
        id={`${idPrefix}-last_name`}
        required
        error={errors.last_name}
      >
        <Input
          id={`${idPrefix}-last_name`}
          value={form.last_name}
          onChange={(e) => set("last_name", e.target.value)}
          placeholder="Enter last name"
          aria-invalid={!!errors.last_name}
        />
      </Field>

      <Field
        label="Phone Number"
        id={`${idPrefix}-phone`}
        required
        hint={
          <span>
            Format: <b>05X-XXXXXXX</b>
          </span>
        }
        error={errors.phone}
      >
        <Input
          id={`${idPrefix}-phone`}
          inputMode="tel"
          value={form.phone}
          onChange={(e) =>
            onPhoneChange
              ? onPhoneChange(e.target.value)
              : set("phone", e.target.value)
          }
          placeholder="05X-XXXXXXX"
          aria-invalid={!!errors.phone}
        />
      </Field>

      <Field
        label="Email"
        id={`${idPrefix}-email`}
        required
        error={errors.email}
      >
        <Input
          id={`${idPrefix}-email`}
          type="email"
          value={form.email}
          onChange={(e) => set("email", e.target.value)}
          placeholder="name@example.com"
          aria-invalid={!!errors.email}
        />
      </Field>

      <Field
        label="Password"
        id={`${idPrefix}-password`}
        required
        hint="Meet the strong password rules (see below)"
        error={errors.password}
      >
        <PasswordInput
          id={`${idPrefix}-password`}
          value={form.password}
          onChange={(e) => set("password", e.target.value)}
          placeholder="Password"
          invalid={!!errors.password}
        />
        <PasswordHints value={form.password} />
      </Field>

      <Field
        label="LinkedIn URL"
        id={`${idPrefix}-linkedin_url`}
        hint="Example: https://www.linkedin.com/in/your-profile"
        error={errors.linkedin_url}
      >
        <Input
          id={`${idPrefix}-linkedin_url`}
          value={form.linkedin_url}
          onChange={(e) => set("linkedin_url", e.target.value)}
          placeholder="https://www.linkedin.com/in/your-profile"
          aria-invalid={!!errors.linkedin_url}
        />
      </Field>

      <Field
        label="Region"
        id={`${idPrefix}-region`}
        hint="e.g., North / South / Center / Remote"
      >
        <Input
          id={`${idPrefix}-region`}
          value={form.region}
          onChange={(e) => set("region", e.target.value)}
          placeholder="e.g., Center"
        />
      </Field>

      <Field
        label="About"
        id={`${idPrefix}-short_description`}
        error={errors.short_description}
        hint={aboutHintText}
      >
        <Textarea
          id={`${idPrefix}-short_description`}
          value={form.short_description}
          onChange={(e) =>
            set(
              "short_description",
              showAboutCounter
                ? e.target.value.slice(0, maxAbout)
                : e.target.value
            )
          }
          placeholder="Tell us about yourself, goals/interests, etc."
        />
        {showAboutCounter && (
          <div className="mt-1 text-xs text-slate-500">
            {form.short_description.length}/{maxAbout} characters
          </div>
        )}
      </Field>

      <Field
        label="Profile Picture"
        id={`${idPrefix}-avatar`}
        hint="Upload, paste URL, or choose a default avatar"
      >
        <ImagePicker
          value={form.image_url}
          onChange={(val) => set("image_url", val)}
          presetAvatars={PRESET_AVATARS}
          // אופציונלי: להחליף צבע מסגרת
          // selectedClass="border-pink-500"
        />
      </Field>
    </>
  );
}
