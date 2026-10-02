import { Link } from "react-router-dom";
import { ArrowUpRight, Check, Loader2 } from "lucide-react";
import Magnetic from "../motion/Magnetic";

// The one button. Pill-shaped (the only rounded element in the system),
// ember fill sweeps up on hover, label rolls, arrow nudges.
// Variants: solid (ink), light (bone, for dark surfaces), outline, ember.
const styles = {
  solid: "bg-ink text-bone",
  light: "bg-bone text-ink",
  outline: "border border-current text-current",
  ember: "bg-ember text-ink",
};
const fills = {
  solid: "bg-ember",
  light: "bg-ember",
  outline: "bg-ink",
  ember: "bg-ink",
};
const hoverText = {
  solid: "group-hover:text-ink",
  light: "group-hover:text-ink",
  outline: "group-hover:text-bone",
  ember: "group-hover:text-bone",
};
const sizes = {
  sm: "h-10 px-5 text-[11px]",
  md: "h-12 px-7 text-xs",
  lg: "h-14 px-9 text-[13px]",
};

const Button = ({
  children,
  to,
  href,
  variant = "solid",
  size = "md",
  icon = true,
  magnetic = false,
  loading = false,
  success = false,
  full = false,
  className = "",
  cursor = "",
  ...rest
}) => {
  const cls = `group relative isolate inline-flex select-none items-center whitespace-nowrap justify-center gap-3 overflow-hidden rounded-full font-medium uppercase tracking-[0.14em] transition-[transform,opacity] duration-200 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50 ${styles[variant]} ${sizes[size]} ${full ? "w-full" : ""} ${className}`;

  const Icon = loading ? Loader2 : success ? Check : ArrowUpRight;
  const inner = (
    <>
      <span
        aria-hidden="true"
        className={`absolute inset-0 -z-10 origin-bottom scale-y-0 rounded-[inherit] transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:scale-y-100 ${fills[variant]}`}
      />
      <span className={`relative block overflow-hidden transition-colors duration-300 ${hoverText[variant]}`}>
        <span className="block transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:-translate-y-full">{children}</span>
        <span aria-hidden="true" className="absolute inset-0 block translate-y-full transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-y-0">
          {children}
        </span>
      </span>
      {(icon || loading || success) && (
        <Icon
          aria-hidden="true"
          size={16}
          strokeWidth={1.75}
          className={`relative transition-[transform,color] duration-500 ease-[var(--ease-out-expo)] ${hoverText[variant]} ${
            loading ? "animate-spin" : success ? "" : "group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:rotate-45"
          }`}
        />
      )}
    </>
  );

  let node;
  if (to) node = <Link to={to} className={cls} data-cursor={cursor} {...rest}>{inner}</Link>;
  else if (href) node = <a href={href} className={cls} data-cursor={cursor} {...rest}>{inner}</a>;
  else node = <button className={cls} data-cursor={cursor} aria-busy={loading || undefined} {...rest}>{inner}</button>;

  return magnetic ? <Magnetic className={full ? "w-full" : ""}>{node}</Magnetic> : node;
};

export default Button;
