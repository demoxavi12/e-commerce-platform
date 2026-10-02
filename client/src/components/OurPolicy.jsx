import { motion } from "framer-motion";
import { RefreshCcw, ShieldCheck, Headphones } from "lucide-react";
import { ease, pad } from "../lib/motion";

const items = [
  { icon: RefreshCcw, title: "Easy exchange", text: "Hassle-free exchanges within 7 days — no forms, no friction." },
  { icon: ShieldCheck, title: "Authentic product", text: "Every piece sourced directly from the brands we carry." },
  { icon: Headphones, title: "Real support", text: "Humans on the other end, 24/7, for anything you need." },
];

const OurPolicy = () => (
  <section className="gutter grid gap-10 py-20 sm:grid-cols-3 sm:gap-8" aria-label="Our promises">
    {items.map(({ icon: Icon, title, text }, i) => (
      <motion.div
        key={title}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
        className="group relative pt-6"
      >
        <motion.span
          variants={{ hidden: { scaleX: 0 }, visible: { scaleX: 1, transition: { duration: 1.2, ease: ease.inOut, delay: i * 0.15 } } }}
          className="absolute left-0 top-0 h-px w-full origin-left bg-ink/20"
        />
        <motion.div
          variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: ease.out, delay: 0.2 + i * 0.15 } } }}
        >
          <div className="flex items-center justify-between">
            <span className="eyebrow text-mute">{pad(i + 1)}</span>
            <Icon size={22} strokeWidth={1.25} className="transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:-rotate-12 group-hover:scale-110 group-hover:text-ember" />
          </div>
          <h3 className="display mt-6 text-3xl sm:text-4xl">{title}</h3>
          <p className="mt-3 max-w-xs text-[15px] leading-relaxed text-mute">{text}</p>
        </motion.div>
      </motion.div>
    ))}
  </section>
);

export default OurPolicy;
