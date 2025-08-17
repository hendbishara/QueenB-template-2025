import { THEME, cls } from "../../lib/theme";

export default function Textarea(props) {
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
