import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { editorial } from "../assets/editorial";
import NewsLetterBox from "../components/NewsLetterBox";
import SplitText from "../components/motion/SplitText";
import Reveal from "../components/motion/Reveal";
import { pad } from "../lib/motion";

const values = [
  { title: "Quality assurance", text: "We ensure every product meets strict quality standards before reaching you." },
  { title: "Convenience", text: "Shop effortlessly with smooth navigation, fast delivery, and secure checkout." },
  { title: "Exceptional support", text: "Our support team is always available to help you at every step." },
];

const About = () => {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], reduced ? ["0%", "0%"] : ["-10%", "10%"]);

  return (
    <div className="page-top">
      <header className="gutter pb-16 pt-8 sm:pt-14">
        <p className="eyebrow text-mute">( About ) — Est. for the in-between hours</p>
        <h1 className="display mt-5 max-w-[14ch] text-[clamp(56px,9vw,152px)]">
          <SplitText text="Fewer things, *made better.*" trigger="mount" accentClassName="italic text-ember" />
        </h1>
      </header>

      <section className="gutter grid gap-12 pb-24 md:grid-cols-[1fr_1fr] md:items-center md:gap-20">
        <Reveal variant="clip" className="relative aspect-[4/5] overflow-hidden bg-stone-2" ref={ref}>
          <motion.img src={editorial.flatlay} alt="Flat lay of denim, knitwear and suede boots" loading="lazy" style={{ y, scale: 1.2 }} className="h-full w-full object-cover" />
        </Reveal>
        <div className="space-y-6 text-[17px] leading-relaxed text-mute">
          <Reveal>
            <p>
              <span className="text-ink">ELEVÉ began with a simple frustration:</span> clothes that look good for a season and give up by the next. So we started
              making the opposite — garments cut from heavier cloth, finished properly, and designed to be worn hard.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <p>We work in small runs with workshops we know by name. That keeps quality high, waste low, and every drop worth waiting for.</p>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="eyebrow pt-4 text-ink">Our mission</p>
            <p className="mt-3">To make the everyday feel considered — pieces that are quietly excellent, honestly priced, and built to stay in your rotation for years.</p>
          </Reveal>
        </div>
      </section>

      <section className="gutter border-t border-ink/10 pt-16" aria-labelledby="why-title">
        <h2 id="why-title" className="display text-[clamp(44px,6vw,96px)]">
          <SplitText text="Why *choose us*" accentClassName="italic text-ember" />
        </h2>
        <div className="mt-12 grid gap-px bg-ink/10 md:grid-cols-3">
          {values.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.12} className="group bg-bone p-8 transition-colors duration-500 hover:bg-ink hover:text-bone">
              <p className="eyebrow text-mute group-hover:text-bone/50">{pad(i + 1)}</p>
              <h3 className="display mt-10 text-4xl">{item.title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-mute group-hover:text-bone/70">{item.text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <NewsLetterBox />
    </div>
  );
};

export default About;
