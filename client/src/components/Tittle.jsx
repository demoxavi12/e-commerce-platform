import SplitText from "./motion/SplitText";

// Section title (name kept for backwards compatibility with existing imports).
// text1 = upright, text2 = italic accent.
const Tittle = ({ text1, text2, eyebrow, className = "", size = "md" }) => {
  const sizes = {
    sm: "text-[clamp(32px,4vw,48px)]",
    md: "text-[clamp(44px,6vw,96px)]",
    lg: "text-[clamp(56px,9vw,152px)]",
  };
  const t1 = text1.trim().toLowerCase().replace(/^./, (c) => c.toUpperCase());
  const t2 = text2.trim().toLowerCase();
  return (
    <div className={className}>
      {eyebrow && <p className="eyebrow mb-4 text-mute">{eyebrow}</p>}
      <h2 className={`display ${sizes[size]}`}>
        <SplitText text={`${t1} *${t2}*`} accentClassName="italic text-ember" />
      </h2>
    </div>
  );
};

export default Tittle;
