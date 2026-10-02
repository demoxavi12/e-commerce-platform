import { useId } from "react";

// Floating-label input with an animated focus line.
// Defined at module level so it never remounts (and never loses focus) on parent re-render.
const Field = ({ label, as = "input", className = "", dark = false, ...props }) => {
  const id = useId();
  const Tag = as;
  return (
    <div className={`group relative ${className}`}>
      <Tag
        id={id}
        placeholder=" "
        {...props}
        className={`peer block w-full resize-none border-0 border-b bg-transparent px-0 pb-2.5 pt-6 text-[15px] outline-none transition-colors ${
          dark ? "border-bone/25 text-bone" : "border-ink/20 text-ink"
        } [&:user-invalid]:border-ember`}
      />
      <label
        htmlFor={id}
        className={`pointer-events-none absolute left-0 top-6 origin-left text-[15px] transition-all duration-300 ease-[var(--ease-out-expo)] peer-focus:top-0 peer-focus:scale-[0.78] peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:scale-[0.78] ${
          dark ? "text-bone/60" : "text-mute"
        }`}
      >
        {label}
      </label>
      <span
        aria-hidden="true"
        className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-ember transition-transform duration-500 ease-[var(--ease-out-expo)] peer-focus:scale-x-100"
      />
    </div>
  );
};

export default Field;
